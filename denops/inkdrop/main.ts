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
import { loadNotesList, openNote } from "./handler/notes_list.ts";
import { loadNote } from "./handler/note.ts";

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
    },
  });

  router.addHandler("note", {
    load: (_ctx, buf) => loadNote(denops, stateMan, buf),
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
        const baseUrl = await input(denops, {
          prompt: "Base URL: ",
          default: "http://127.0.0.1:19840",
        });
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
  });
}
