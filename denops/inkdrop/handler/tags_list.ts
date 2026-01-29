import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as variable from "@denops/std/variable";
import * as option from "@denops/std/option";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { as, ensure, is } from "@core/unknownutil";

import { InkdropClient, type TagDoc } from "@kyoh86/inkdrop-local";
import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import {
  type Buffer,
  isBufferOpener,
  type Router,
} from "@kyoh86/denops-router";

export async function loadTagsList(
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

    const tags = await client.tags.list<TagDoc>();
    const tagIds = tags.map((tag) => tag._id);
    const tagTitles = tags.map((tag) => tag.name);

    await buffer.ensure(denops, buf.bufnr, async () => {
      await batch(denops, async (denops) => {
        await variable.b.set(denops, "inkdrop_tags_list_ids", tagIds);
        await buffer.replace(denops, buf.bufnr, tagTitles);
        await option.filetype.setLocal(denops, Filetype.TagsList);
        await option.modified.setLocal(denops, false);
        await option.readonly.setLocal(denops, true);
      });
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function openTagsList(
  denops: Denops,
  router: Router,
  uParams: Record<string, unknown>,
) {
  const params = ensure(
    uParams,
    is.ObjectOf({ lnum: is.Number, open_option: as.Optional(isBufferOpener) }),
  );
  const tagIds = ensure(
    await variable.b.get(denops, "inkdrop_tags_list_ids"),
    is.ArrayOf(is.String),
  );
  const tagId = tagIds[params.lnum - 1];
  if (!tagId) {
    return;
  }
  await router.open(
    denops,
    "notes-list",
    { tagId },
    undefined,
    params.open_option,
  );
}

export async function refreshTagsList(denops: Denops, router: Router) {
  await router.open(denops, "tags-list");
}
