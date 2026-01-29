import type { Denops } from "@denops/std";
import * as buffer from "@denops/std/buffer";
import * as option from "@denops/std/option";
import * as variable from "@denops/std/variable";
import { batch } from "@denops/std/batch";
import { getLogger } from "@std/log";
import { ensure, is } from "@core/unknownutil";

import { Filetype } from "./filetype.ts";
import type { StateMan } from "../state.ts";
import { type Buffer, type Router } from "@kyoh86/denops-router";

type MenuAction = {
  kind: "notes" | "books" | "tags";
  params?: Record<string, string>;
};

export async function loadMenuList(
  denops: Denops,
  _stateMan: StateMan,
  buf: Buffer,
) {
  try {
    await option.bufhidden.setBuffer(denops, buf.bufnr, "wipe");

    const items: { label: string; action?: MenuAction }[] = [
      { label: "All Notes", action: { kind: "notes", params: {} } },
      {
        label: "Pinned Notes",
        action: { kind: "notes", params: { pinned: "1" } },
      },
      { label: "Notebooks", action: { kind: "books" } },
      { label: "Tags", action: { kind: "tags" } },
      {
        label: "Status: Active",
        action: { kind: "notes", params: { status: "active" } },
      },
      {
        label: "Status: On Hold",
        action: { kind: "notes", params: { status: "onHold" } },
      },
      {
        label: "Status: Completed",
        action: { kind: "notes", params: { status: "completed" } },
      },
      {
        label: "Status: Dropped",
        action: { kind: "notes", params: { status: "dropped" } },
      },
    ];

    const actions = items.map((item) => item.action ?? null);
    const labels = items.map((item) => item.label);

    await buffer.ensure(denops, buf.bufnr, async () => {
      await batch(denops, async (denops) => {
        await variable.b.set(denops, "inkdrop_menu_actions", actions);
        await buffer.replace(denops, buf.bufnr, labels);
        await option.filetype.setLocal(denops, Filetype.MenuList);
        await option.modified.setLocal(denops, false);
        await option.readonly.setLocal(denops, true);
      });
    });
  } catch (err) {
    getLogger("denops-inkdrop").error(err);
  }
}

export async function openMenuList(
  denops: Denops,
  router: Router,
  uParams: Record<string, unknown>,
) {
  const params = ensure(uParams, is.ObjectOf({ lnum: is.Number }));
  const actions = await variable.b.get(
    denops,
    "inkdrop_menu_actions",
  ) as Array<MenuAction | null> | undefined;
  const action = actions?.[params.lnum - 1];
  if (!action) {
    return;
  }

  switch (action.kind) {
    case "notes":
      await router.open(denops, "notes-list", action.params ?? {});
      return;
    case "books":
      await router.open(denops, "books-list");
      return;
    case "tags":
      await router.open(denops, "tags-list");
      return;
  }
}
