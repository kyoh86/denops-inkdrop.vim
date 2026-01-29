import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as variable from "@denops/std/variable";
import * as option from "@denops/std/option";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { as, ensure, is } from "@core/unknownutil";
import { input } from "@denops/std/helper";
import * as fn from "@denops/std/function";

import { type BookDoc, InkdropClient } from "@kyoh86/inkdrop-local";
import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import {
  type Buffer,
  isBufferOpener,
  type Router,
} from "@kyoh86/denops-router";

export async function loadBooksList(
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

    const books = await client.books.list<BookDoc>();
    const bookIds = books.map((book) => book._id);
    const bookTitles = books.map((book) => book.name);

    await buffer.ensure(denops, buf.bufnr, async () => {
      await batch(denops, async (denops) => {
        await variable.b.set(denops, "inkdrop_books_list_ids", bookIds);
        await variable.b.set(denops, "inkdrop_books_list_titles", bookTitles);
        await buffer.replace(denops, buf.bufnr, bookTitles);
        await option.filetype.setLocal(denops, Filetype.BooksList);
        await option.modified.setLocal(denops, false);
        await option.readonly.setLocal(denops, true);
      });
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function openBooksList(
  denops: Denops,
  router: Router,
  uParams: Record<string, unknown>,
) {
  const params = ensure(
    uParams,
    is.ObjectOf({ lnum: is.Number, open_option: as.Optional(isBufferOpener) }),
  );
  const bookIds = ensure(
    await variable.b.get(denops, "inkdrop_books_list_ids"),
    is.ArrayOf(is.String),
  );
  const bookId = bookIds[params.lnum - 1];
  if (!bookId) {
    return;
  }
  const bookTitles = ensure(
    await variable.b.get(denops, "inkdrop_books_list_titles"),
    as.Optional(is.ArrayOf(is.String)),
  );
  const bookName = bookTitles?.[params.lnum - 1];
  await router.open(
    denops,
    "notes-list",
    { bookId, bookName },
    undefined,
    params.open_option,
  );
}

export async function refreshBooksList(denops: Denops, router: Router) {
  await router.open(denops, "books-list");
}

export async function renameBook(
  denops: Denops,
  stateMan: StateMan,
  router: Router,
  uParams: Record<string, unknown>,
) {
  try {
    const params = ensure(uParams, is.ObjectOf({ lnum: is.Number }));
    const bookIds = ensure(
      await variable.b.get(denops, "inkdrop_books_list_ids"),
      is.ArrayOf(is.String),
    );
    const bookId = bookIds[params.lnum - 1];
    if (!bookId) {
      return;
    }

    const state = await stateMan.load();
    if (!state) {
      getLogger("denops-inkdrop").error(
        "No credentials found. Run :InkdropLogin first.",
      );
      return;
    }

    const currentName = await fn.getline(denops, params.lnum) as string;
    const newName = await input(denops, {
      prompt: "Book name: ",
      text: currentName ?? "",
    });
    if (!newName || newName.trim() === currentName) {
      return;
    }

    const client = new InkdropClient({
      baseUrl: state.baseUrl,
      username: state.username,
      password: state.password,
    });
    const book = await client.docs.get<BookDoc>(bookId);
    await client.books.upsert({
      ...book,
      name: newName.trim(),
    });
    await router.open(denops, "books-list");
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function newBook(
  denops: Denops,
  stateMan: StateMan,
  router: Router,
) {
  try {
    const state = await stateMan.load();
    if (!state) {
      getLogger("denops-inkdrop").error(
        "No credentials found. Run :InkdropLogin first.",
      );
      return;
    }

    const name = await input(denops, { prompt: "Book name: " });
    if (!name) {
      getLogger("denops-inkdrop").warn("Cancelled");
      return;
    }

    const client = new InkdropClient({
      baseUrl: state.baseUrl,
      username: state.username,
      password: state.password,
    });
    await client.books.upsert({ name: name.trim() });
    await router.open(denops, "books-list");
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}
