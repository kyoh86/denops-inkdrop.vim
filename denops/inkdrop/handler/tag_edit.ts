import type { Denops } from "@denops/std";
import { input } from "@denops/std/helper";
import * as variable from "@denops/std/variable";
import { getLogger } from "@std/log";
import { ensure, is } from "@core/unknownutil";

import {
  InkdropClient,
  type NoteDoc,
  type TagDoc,
} from "@kyoh86/inkdrop-local";
import type { StateMan } from "../state.ts";

function uniqByName(names: string[]): string[] {
  const seen = new Set<string>();
  const uniques: string[] = [];
  for (const name of names) {
    if (seen.has(name)) {
      continue;
    }
    seen.add(name);
    uniques.push(name);
  }
  return uniques;
}

export async function editTags(denops: Denops, stateMan: StateMan) {
  const logger = getLogger("denops-inkdrop");
  try {
    const noteId = ensure(
      await variable.b.get(denops, "inkdrop_note_id"),
      is.String,
    );

    const state = await stateMan.load();
    if (!state) {
      logger.error("No credentials found. Run :InkdropLogin first.");
      return;
    }

    const client = new InkdropClient({
      baseUrl: state.baseUrl,
      username: state.username,
      password: state.password,
    });

    const [note, tags] = await Promise.all([
      client.docs.get<NoteDoc>(noteId),
      client.tags.list<TagDoc>(),
    ]);

    const tagsById = new Map(tags.map((tag) => [tag._id, tag]));
    const tagsByName = new Map(tags.map((tag) => [tag.name, tag]));
    const currentTagNames = (note.tags ?? [])
      .map((id) => tagsById.get(id)?.name)
      .filter((name): name is string => Boolean(name));

    const inputValue = await input(denops, {
      prompt: "Tags (comma-separated): ",
      text: currentTagNames.join(", "),
    });
    if (inputValue === null) {
      logger.warn("Cancelled");
      return;
    }

    const requestedNames = uniqByName(
      inputValue
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0),
    );

    const tagIds: string[] = [];
    for (const name of requestedNames) {
      const existing = tagsByName.get(name);
      if (existing) {
        tagIds.push(existing._id);
        continue;
      }
      const created = await client.tags.upsert({ name });
      tagIds.push(created.id);
    }

    await client.notes.upsert({
      ...note,
      tags: tagIds,
    });
  } catch (err) {
    logger.error(err);
  }
}
