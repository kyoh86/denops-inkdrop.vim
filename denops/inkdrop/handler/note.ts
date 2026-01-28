import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as option from "@denops/std/option";
import * as variable from "@denops/std/variable";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { ensure, is } from "@core/unknownutil";

import { InkdropClient, type NoteDoc } from "@kyoh86/inkdrop-local";
import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import type { Buffer } from "@kyoh86/denops-router";
import * as fn from "@denops/std/function";

export async function loadNote(
  denops: Denops,
  stateMan: StateMan,
  buf: Buffer,
) {
  try {
    const params = ensure(
      buf.bufname.params,
      is.ObjectOf({ noteId: is.String }),
    );

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

    const note = await client.docs.get<NoteDoc>(params.noteId);
    const lines: string[] = [];
    if (note.title) {
      lines.push(`# ${note.title}`);
      lines.push("");
    }
    if (note.body) {
      lines.push(...note.body.split("\n"));
    }

    await buffer.ensure(denops, buf.bufnr, async () => {
      await batch(denops, async (denops) => {
        await buffer.replace(denops, buf.bufnr, lines);
        await variable.b.set(denops, "inkdrop_note_id", params.noteId);
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

export async function saveNote(
  denops: Denops,
  stateMan: StateMan,
  _buf: Buffer,
) {
  try {
    const noteId = ensure(
      await variable.b.get(denops, "inkdrop_note_id"),
      is.String,
    );

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

    const note = await client.docs.get<NoteDoc>(noteId);
    const lines = await fn.getline(denops, 1, "$") as string[];
    const parsed = parseNote(lines);

    await client.notes.upsert({
      ...note,
      title: parsed.title,
      body: parsed.body,
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}
