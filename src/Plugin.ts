import type { Plugin } from "vite";
import Transpiler from "./Transformer";
export default function vuelte(parentElementName?: string): Plugin {
  return {
    name: "vite-vuelte-renderer",
    enforce: "pre",
    async transform(code: string, id: string) {
      if (!id.endsWith(".vue")) return;
      return new Transpiler(code, parentElementName || "div").transform();
    },
  };
}
