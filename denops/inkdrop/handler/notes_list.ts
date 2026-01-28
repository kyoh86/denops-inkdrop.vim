import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as variable from "@denops/std/variable";
import * as option from "@denops/std/option";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { as, ensure, is } from "@core/unknownutil";

import { InkdropClient } from "@kyoh86/inkdrop-local";
import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import {
  type Buffer,
  isBufferOpener,
  type Router,
} from "@kyoh86/denops-router";

export async function loadNotesList(
  denops: Denops,
  stateMan: StateMan,
  buf: Buffer,
) {
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

  const notes = await client.notes.list({
    limit: 100,
    sort: "updatedAt",
    descending: true,
  });

  const noteIds = notes.map((note) => note._id);
  const noteTitles = notes.map((note) => note.title ?? "(untitled)");

  await buffer.ensure(denops, buf.bufnr, async () => {
    await batch(denops, async (denops) => {
      await variable.b.set(denops, "inkdrop_notes_list_ids", noteIds);
      await buffer.replace(denops, buf.bufnr, noteTitles);
      await option.filetype.setLocal(denops, Filetype.NotesList);
      await option.modified.setLocal(denops, false);
      await option.readonly.setLocal(denops, true);
    });
  });
}

export async function openNote(
  denops: Denops,
  router: Router,
  uParams: Record<string, unknown>,
) {
  const params = ensure(
    uParams,
    is.ObjectOf({ lnum: is.Number, open_option: as.Optional(isBufferOpener) }),
  );
  const noteIds = ensure(
    await variable.b.get(denops, "inkdrop_notes_list_ids"),
    is.ArrayOf(is.String),
  );
  const noteId = noteIds[params.lnum - 1];
  if (!noteId) {
    return;
  }
  await router.open(
    denops,
    "note",
    { noteId },
    undefined,
    params.open_option,
  );
}
