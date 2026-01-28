import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as variable from "@denops/std/variable";
import * as option from "@denops/std/option";
import { batch, collect } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { as, ensure, is } from "@core/unknownutil";
import * as vars from "@denops/std/variable";

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
  const params = ensure(
    buf.bufname.params,
    is.ObjectOf({
      q: as.Optional(is.String),
      limit: as.Optional(is.String),
      skip: as.Optional(is.String),
      sort: as.Optional(is.String),
      descending: as.Optional(is.String),
    }),
  );
  const [defaultLimit, defaultSort, defaultDescending] = await collect(
    denops,
    (denops) => [
      vars.g.get(denops, "inkdrop_notes_limit", 100),
      vars.g.get(denops, "inkdrop_notes_sort", "updatedAt"),
      vars.g.get(denops, "inkdrop_notes_descending", 1),
    ],
  );

  const limit = params.limit ? Number(params.limit) : Number(defaultLimit);
  const skip = params.skip ? Number(params.skip) : 0;
  const sort = (params.sort || defaultSort) as
    | "updatedAt"
    | "createdAt"
    | "title";
  const descending = params.descending
    ? params.descending === "1" || params.descending === "true"
    : Number(defaultDescending) !== 0;
  const q = params.q;

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
    keyword: q,
    limit,
    skip,
    sort,
    descending,
  });

  const noteIds = notes.map((note) => note._id);
  const noteTitles = notes.map((note) => note.title ?? "(untitled)");

  await buffer.ensure(denops, buf.bufnr, async () => {
    await batch(denops, async (denops) => {
      await variable.b.set(denops, "inkdrop_notes_list_ids", noteIds);
      await variable.b.set(denops, "inkdrop_notes_list_q", q);
      await variable.b.set(denops, "inkdrop_notes_list_limit", limit);
      await variable.b.set(denops, "inkdrop_notes_list_skip", skip);
      await variable.b.set(denops, "inkdrop_notes_list_sort", sort);
      await variable.b.set(
        denops,
        "inkdrop_notes_list_descending",
        descending ? 1 : 0,
      );
      await buffer.replace(denops, buf.bufnr, noteTitles);
      await option.filetype.setLocal(denops, Filetype.NotesList);
      await option.modified.setLocal(denops, false);
      await option.readonly.setLocal(denops, true);
    });
  });
}

async function getListState(denops: Denops, buf: Buffer) {
  return await buffer.ensure(denops, buf.bufnr, async () => {
    return {
      q: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_q"),
        as.Optional(is.String),
      ),
      limit: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_limit", 100),
        is.Number,
      ),
      skip: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_skip", 0),
        is.Number,
      ),
      sort: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_sort", "updatedAt"),
        is.String,
      ),
      descending: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_descending", 1),
        is.Number,
      ) !== 0,
    };
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

export async function refreshNotesList(
  denops: Denops,
  router: Router,
  buf: Buffer,
) {
  const { q, limit, skip, sort, descending } = await getListState(denops, buf);
  await router.open(denops, "notes-list", {
    q,
    limit: limit.toString(),
    skip: skip.toString(),
    sort,
    descending: descending ? "1" : "0",
  });
}

export async function nextNotesList(
  denops: Denops,
  router: Router,
  buf: Buffer,
) {
  const { q, limit, skip, sort, descending } = await getListState(denops, buf);
  await router.open(denops, "notes-list", {
    q,
    limit: limit.toString(),
    skip: (skip + limit).toString(),
    sort,
    descending: descending ? "1" : "0",
  });
}

export async function prevNotesList(
  denops: Denops,
  router: Router,
  buf: Buffer,
) {
  const { q, limit, skip, sort, descending } = await getListState(denops, buf);
  const nextSkip = Math.max(0, skip - limit);
  await router.open(denops, "notes-list", {
    q,
    limit: limit.toString(),
    skip: nextSkip.toString(),
    sort,
    descending: descending ? "1" : "0",
  });
}
