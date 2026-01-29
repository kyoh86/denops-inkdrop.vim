import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as variable from "@denops/std/variable";
import * as option from "@denops/std/option";
import { batch, collect } from "@denops/std/batch";
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
import { setNoteStatusById } from "./note_actions.ts";

export async function loadNotesList(
  denops: Denops,
  stateMan: StateMan,
  buf: Buffer,
) {
  try {
    const params = ensure(
      buf.bufname.params,
      as.Optional(
        is.ObjectOf({
          q: as.Optional(is.String),
          bookId: as.Optional(is.String),
          bookName: as.Optional(is.String),
          tagId: as.Optional(is.String),
          tagName: as.Optional(is.String),
          status: as.Optional(is.String),
          pinned: as.Optional(is.String),
          limit: as.Optional(is.String),
          skip: as.Optional(is.String),
          sort: as.Optional(is.String),
          descending: as.Optional(is.String),
        }),
      ),
    ) ?? {};
    const [defaultLimit, defaultSort, defaultDescending] = await collect(
      denops,
      (denops) => [
        variable.g.get(denops, "inkdrop_notes_limit", 100),
        variable.g.get(denops, "inkdrop_notes_sort", "updatedAt"),
        variable.g.get(denops, "inkdrop_notes_descending", 1),
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
    const bookId = params.bookId;
    const bookName = params.bookName;
    const tagId = params.tagId;
    const tagName = params.tagName;
    const statusParam = params.status;
    const statuses = statusParam
      ? statusParam.split(",").map((value) => value.trim()).filter(Boolean)
      : [];
    const pinned = params.pinned
      ? params.pinned === "1" || params.pinned === "true"
      : false;

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
    let filteredNotes = notes;
    if (bookId) {
      filteredNotes = filteredNotes.filter((note) => note.bookId === bookId);
    }
    if (tagId) {
      filteredNotes = filteredNotes.filter((note) =>
        note.tags?.includes(tagId)
      );
    }
    if (statuses.length > 0) {
      filteredNotes = filteredNotes.filter((note) =>
        statuses.includes(note.status ?? "none")
      );
    }
    if (pinned) {
      filteredNotes = filteredNotes.filter((note) => note.pinned);
    }
    const noteIds = filteredNotes.map((note) => note._id);
    const noteTitles = filteredNotes.map((note) => note.title ?? "(untitled)");

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
        await variable.b.set(denops, "inkdrop_notes_list_book_id", bookId);
        await variable.b.set(denops, "inkdrop_notes_list_tag_id", tagId);
        await variable.b.set(denops, "inkdrop_notes_list_book_name", bookName);
        await variable.b.set(denops, "inkdrop_notes_list_tag_name", tagName);
        await variable.b.set(
          denops,
          "inkdrop_notes_list_status",
          statuses.join(","),
        );
        await variable.b.set(
          denops,
          "inkdrop_notes_list_pinned",
          pinned ? 1 : 0,
        );
        await buffer.replace(denops, buf.bufnr, noteTitles);
        await option.filetype.setLocal(denops, Filetype.NotesList);
        await option.modified.setLocal(denops, false);
        await option.readonly.setLocal(denops, true);
        const labels = [];
        if (q) {
          labels.push(`q=${q}`);
        }
        if (bookName || bookId) {
          labels.push(`book=${bookName ?? bookId}`);
        }
        if (tagName || tagId) {
          labels.push(`tag=${tagName ?? tagId}`);
        }
        if (statuses.length > 0) {
          labels.push(`status=${statuses.join("+")}`);
        }
        if (pinned) {
          labels.push("pinned");
        }
        if (labels.length > 0) {
          await option.statusline.setLocal(
            denops,
            `Inkdrop [${labels.join(", ")}]`,
          );
        }
      });
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

async function getListState(denops: Denops, buf: Buffer) {
  return await buffer.ensure(denops, buf.bufnr, async () => {
    return {
      q: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_q"),
        as.Optional(is.String),
      ),
      bookId: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_book_id"),
        as.Optional(is.String),
      ),
      bookName: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_book_name"),
        as.Optional(is.String),
      ),
      tagId: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_tag_id"),
        as.Optional(is.String),
      ),
      tagName: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_tag_name"),
        as.Optional(is.String),
      ),
      status: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_status"),
        as.Optional(is.String),
      ),
      pinned: ensure(
        await variable.b.get(denops, "inkdrop_notes_list_pinned", 0),
        is.Number,
      ) !== 0,
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

export async function setNoteStatusFromList(
  denops: Denops,
  stateMan: StateMan,
  uParams: Record<string, unknown>,
) {
  const params = ensure(uParams, is.ObjectOf({ lnum: is.Number }));
  const noteIds = ensure(
    await variable.b.get(denops, "inkdrop_notes_list_ids"),
    is.ArrayOf(is.String),
  );
  const noteId = noteIds[params.lnum - 1];
  if (!noteId) {
    return;
  }
  await setNoteStatusById(denops, stateMan, noteId);
}

export async function refreshNotesList(
  denops: Denops,
  router: Router,
  buf: Buffer,
) {
  const {
    q,
    bookId,
    bookName,
    tagId,
    tagName,
    status,
    pinned,
    limit,
    skip,
    sort,
    descending,
  } = await getListState(
    denops,
    buf,
  );
  await router.open(denops, "notes-list", {
    q,
    bookId,
    bookName,
    tagId,
    tagName,
    status,
    pinned: pinned ? "1" : "0",
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
  const {
    q,
    bookId,
    bookName,
    tagId,
    tagName,
    status,
    pinned,
    limit,
    skip,
    sort,
    descending,
  } = await getListState(
    denops,
    buf,
  );
  await router.open(denops, "notes-list", {
    q,
    bookId,
    bookName,
    tagId,
    tagName,
    status,
    pinned: pinned ? "1" : "0",
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
  const {
    q,
    bookId,
    bookName,
    tagId,
    tagName,
    status,
    pinned,
    limit,
    skip,
    sort,
    descending,
  } = await getListState(
    denops,
    buf,
  );
  const nextSkip = Math.max(0, skip - limit);
  await router.open(denops, "notes-list", {
    q,
    bookId,
    bookName,
    tagId,
    tagName,
    status,
    pinned: pinned ? "1" : "0",
    limit: limit.toString(),
    skip: nextSkip.toString(),
    sort,
    descending: descending ? "1" : "0",
  });
}
