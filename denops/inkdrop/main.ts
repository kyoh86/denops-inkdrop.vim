import type { Denops } from "@denops/std";
import { echo, input } from "@denops/std/helper";
import xdg from "@404wolf/xdg-portable";
import { join } from "@std/path";
import { ensureFile } from "@std/fs";
import {
  ConsoleHandler,
  getLogger,
  RotatingFileHandler,
  setup,
} from "@std/log";

import { Router } from "@kyoh86/denops-router";
import { XDGStateMan } from "./state.ts";
import {
  loadNotesList,
  nextNotesList,
  openNote,
  prevNotesList,
  refreshNotesList,
} from "./handler/notes_list.ts";
import { loadNote, saveNote } from "./handler/note.ts";
import { loadNewNote, saveNewNote } from "./handler/new_note.ts";
import { loadBooksList, openBooksList } from "./handler/books_list.ts";
import { loadTagsList, openTagsList } from "./handler/tags_list.ts";
import { editTags } from "./handler/tag_edit.ts";

export async function main(denops: Denops) {
  const stateMan = new XDGStateMan();
  const cacheFile = join(xdg.cache(), "denops-inkdrop", "log.txt");
  await ensureFile(cacheFile);

  setup({
    handlers: {
      console: new ConsoleHandler("DEBUG"),
      cache: new RotatingFileHandler("DEBUG", {
        filename: cacheFile,
        maxBytes: 1024 * 1024,
        maxBackupCount: 1,
      }),
    },
    loggers: {
      "denops-inkdrop": {
        level: "INFO",
        handlers: ["console", "cache"],
      },
      "denops-inkdrop-verbose": {
        level: "DEBUG",
        handlers: ["cache"],
      },
    },
  });

  const router = new Router("inkdrop");
  router.addHandler("notes-list", {
    load: (_ctx, buf) => loadNotesList(denops, stateMan, buf),
    actions: {
      open: (_, params) => openNote(denops, router, params),
      refresh: (buf, _) => refreshNotesList(denops, router, buf),
      next: (buf, _) => nextNotesList(denops, router, buf),
      prev: (buf, _) => prevNotesList(denops, router, buf),
    },
  });

  router.addHandler("books-list", {
    load: (_ctx, buf) => loadBooksList(denops, stateMan, buf),
    actions: {
      open: (_, params) => openBooksList(denops, router, params),
    },
  });

  router.addHandler("tags-list", {
    load: (_ctx, buf) => loadTagsList(denops, stateMan, buf),
    actions: {
      open: (_, params) => openTagsList(denops, router, params),
    },
  });

  router.addHandler("note", {
    load: (_ctx, buf) => loadNote(denops, stateMan, buf),
    save: (_ctx, buf) => saveNote(denops, stateMan, buf),
  });

  router.addHandler("new-note", {
    load: (_ctx, buf) => loadNewNote(denops, stateMan, buf),
    save: (_ctx, buf) => saveNewNote(denops, stateMan, buf),
  });

  denops.dispatcher = await router.dispatch(denops, {
    async login() {
      try {
        const username = await input(denops, { prompt: "Username: " });
        if (!username) {
          getLogger("denops-inkdrop").warn("Cancelled");
          return;
        }
        const password = await input(denops, {
          prompt: "Password: ",
          inputsave: true,
        });
        if (!password) {
          getLogger("denops-inkdrop").warn("Cancelled");
          return;
        }
        const baseUrl =
          (await denops.eval("get(g:, 'inkdrop_base_url', '')")) as string;
        const normalizedBaseUrl = (baseUrl || "http://127.0.0.1:19840")
          .trim()
          .replace(/;+$/, "");
        await stateMan.save({
          baseUrl: normalizedBaseUrl,
          username,
          password,
        });
        await echo(denops, "Done");
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
    async logout() {
      try {
        await stateMan.remove();
        await echo(denops, "Logged out");
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
    async newNote() {
      try {
        await router.open(denops, "new-note");
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
    async books() {
      try {
        await router.open(denops, "books-list");
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
    async tags() {
      try {
        await router.open(denops, "tags-list");
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
    async tagEdit() {
      try {
        await editTags(denops, stateMan);
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
    async search() {
      try {
        const keyword = await input(denops, { prompt: "Keyword: " });
        if (!keyword) {
          getLogger("denops-inkdrop").warn("Cancelled");
          return;
        }
        await router.open(denops, "notes-list", { q: keyword });
      } catch (err) {
        getLogger("denops-inkdrop").error(err);
      }
    },
  });
}
