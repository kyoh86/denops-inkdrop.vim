import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as option from "@denops/std/option";
import * as variable from "@denops/std/variable";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { ensure, is } from "@core/unknownutil";

import { type BookDoc, InkdropClient } from "@kyoh86/inkdrop-local";
import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import type { Buffer } from "@kyoh86/denops-router";
import * as fn from "@denops/std/function";
import * as vars from "@denops/std/variable";

async function resolveBookId(
  denops: Denops,
  client: InkdropClient,
): Promise<string | undefined> {
  const configured = await vars.g.get(denops, "inkdrop_default_book_id");
  if (configured) {
    return ensure(configured, is.String);
  }
  const books = await client.books.list<BookDoc>({ limit: 1, skip: 0 });
  return books[0]?._id;
}

function parseNote(lines: string[]): { title?: string; body: string } {
  if (lines.length === 0) {
    return { body: "" };
  }
  const first = lines[0];
  if (first.startsWith("# ")) {
    const title = first.slice(2);
    const bodyLines = lines.slice(1);
    if (bodyLines[0] === "") {
      bodyLines.shift();
    }
    return { title, body: bodyLines.join("\n") };
  }
  return { body: lines.join("\n") };
}

export async function loadNewNote(
  denops: Denops,
  stateMan: StateMan,
  buf: Buffer,
) {
  try {
    await option.bufhidden.setBuffer(denops, buf.bufnr, "wipe");

    const state = await stateMan.load();
    if (!state) {
      getLogger("denops-inkdrop").error(
        "No credentials found. Run :InkdropLogin first.",
      );
      return;
    }

    const client = new InkdropClient({
      baseUrl: state.baseUrl,
      username: state.username,
      password: state.password,
    });

    const bookId = await resolveBookId(denops, client);
    if (!bookId) {
      getLogger("denops-inkdrop").error(
        "No notebook found. Set g:inkdrop_default_book_id first.",
      );
      return;
    }

    await buffer.ensure(denops, buf.bufnr, async () => {
      await batch(denops, async (denops) => {
        await buffer.replace(denops, buf.bufnr, ["# ", ""]);
        await variable.b.set(denops, "inkdrop_new_note_book_id", bookId);
        await option.filetype.setLocal(denops, Filetype.Note);
        await option.modified.setLocal(denops, false);
        await option.readonly.setLocal(denops, false);
        await option.modifiable.setLocal(denops, true);
      });
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function saveNewNote(
  denops: Denops,
  stateMan: StateMan,
  _buf: Buffer,
) {
  try {
    const state = await stateMan.load();
    if (!state) {
      getLogger("denops-inkdrop").error(
        "No credentials found. Run :InkdropLogin first.",
      );
      return;
    }

    const client = new InkdropClient({
      baseUrl: state.baseUrl,
      username: state.username,
      password: state.password,
    });

    const bookId = ensure(
      await variable.b.get(denops, "inkdrop_new_note_book_id"),
      is.String,
    );
    const lines = await fn.getline(denops, 1, "$") as string[];
    const parsed = parseNote(lines);

    const response = await client.notes.upsert({
      doctype: "markdown",
      status: "active",
      bookId,
      title: parsed.title,
      body: parsed.body,
    });

    await variable.b.set(denops, "inkdrop_note_id", response.id);
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}
