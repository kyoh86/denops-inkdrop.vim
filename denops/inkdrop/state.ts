import xdg from "@404wolf/xdg-portable";
import { join } from "@std/path";
import { ensureFile, exists } from "@std/fs";
import { parse, stringify } from "@std/toml";
import { is, maybe } from "@core/unknownutil";

export type State = {
  baseUrl: string;
  username: string;
  password: string;
};

export interface StateMan {
  load(): Promise<State | undefined>;
  save(state: State): Promise<void>;
  remove(): Promise<void>;
}

export class XDGStateMan implements StateMan {
  static statePath() {
    return join(xdg.state(), "denops-inkdrop", "credentials.toml");
  }

  async load() {
    const path = XDGStateMan.statePath();
    if (!await exists(path, { isFile: true, isReadable: true })) {
      return;
    }
    return maybe(
      parse(await Deno.readTextFile(path)),
      is.ObjectOf({
        baseUrl: is.String,
        username: is.String,
        password: is.String,
      }),
    );
  }

  async save(state: State) {
    const path = XDGStateMan.statePath();
    await ensureFile(path);
    return Deno.writeTextFile(path, stringify(state), { create: true });
  }

  async remove() {
    const path = XDGStateMan.statePath();
    if (await exists(path, { isFile: true })) {
      await Deno.remove(path);
    }
  }
}
