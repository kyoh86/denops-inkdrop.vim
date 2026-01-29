import type { Denops } from "@denops/std";
import * as variable from "@denops/std/variable";
import * as fn from "@denops/std/function";
import { getLogger } from "@std/log";
import { ensure, is } from "@core/unknownutil";

import {
  type BookDoc,
  InkdropClient,
  type NoteDoc,
  type NoteStatus,
} from "@kyoh86/inkdrop-local";
import type { StateMan } from "../state.ts";

async function updateNoteStatusById(
  stateMan: StateMan,
  noteId: string,
  status: NoteStatus,
): Promise<void> {
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
  await client.notes.upsert({
    ...note,
    status,
  });
}

async function promptNoteStatus(
  denops: Denops,
  current: NoteStatus,
): Promise<NoteStatus | undefined> {
  const labels: Array<{ status: NoteStatus; label: string }> = [
    { status: "none", label: "None" },
    { status: "active", label: "Active" },
    { status: "onHold", label: "On Hold" },
    { status: "completed", label: "Completed" },
    { status: "dropped", label: "Dropped" },
  ];
  const items = [
    "Select status:",
    ...labels.map((item, index) => {
      const marker = item.status === current ? " (current)" : "";
      return `${index + 1}. ${item.label}${marker}`;
    }),
  ];
  const selected = await denops.call("inputlist", items) as number;
  if (selected <= 0 || selected > labels.length) {
    return;
  }
  return labels[selected - 1].status;
}

export async function setNoteStatus(denops: Denops, stateMan: StateMan) {
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
    const current = note.status ?? "none";
    const selected = await promptNoteStatus(denops, current);
    if (!selected) {
      return;
    }
    await updateNoteStatusById(stateMan, noteId, selected);
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function setNoteStatusById(
  denops: Denops,
  stateMan: StateMan,
  noteId: string,
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
    const note = await client.docs.get<NoteDoc>(noteId);
    const current = note.status ?? "none";
    const selected = await promptNoteStatus(denops, current);
    if (!selected) {
      return;
    }
    await updateNoteStatusById(stateMan, noteId, selected);
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function deleteNote(denops: Denops, stateMan: StateMan) {
  try {
    const noteId = ensure(
      await variable.b.get(denops, "inkdrop_note_id"),
      is.String,
    );
    const ok = await fn.confirm(
      denops,
      "Delete this note?",
      "&Yes\n&No",
      2,
    );
    if (ok !== 1) {
      return;
    }
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
    await client.docs.delete(noteId);
    await denops.cmd("bdelete");
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function setNoteBook(denops: Denops, stateMan: StateMan) {
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
    const [note, books] = await Promise.all([
      client.docs.get<NoteDoc>(noteId),
      client.books.list<BookDoc>(),
    ]);
    const currentBookId = note.bookId;
    const items = [
      "Select book:",
      ...books.map((book, index) => {
        const marker = book._id === currentBookId ? " (current)" : "";
        return `${index + 1}. ${book.name}${marker}`;
      }),
    ];
    const selected = await denops.call("inputlist", items) as number;
    if (selected <= 0 || selected > books.length) {
      return;
    }
    const nextBook = books[selected - 1];
    if (!nextBook || nextBook._id === currentBookId) {
      return;
    }
    await client.notes.upsert({
      ...note,
      bookId: nextBook._id,
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}
