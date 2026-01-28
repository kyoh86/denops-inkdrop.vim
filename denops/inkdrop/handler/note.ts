import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as option from "@denops/std/option";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { ensure, is } from "@core/unknownutil";

import { InkdropClient } from "@kyoh86/inkdrop-local";
import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import type { Buffer } from "@kyoh86/denops-router";

export async function loadNote(
  denops: Denops,
  stateMan: StateMan,
  buf: Buffer,
) {
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

  const note = await client.docs.get(params.noteId);
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
      await option.filetype.setLocal(denops, Filetype.Note);
      await option.modified.setLocal(denops, false);
      await option.readonly.setLocal(denops, true);
    });
  });
}
