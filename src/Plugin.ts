import type { Plugin } from "vite";
import Transpiler from "./Transformer";
export default function vuelte(parentElementName?: string): Plugin {
  return {
    name: "vite-vuelte-renderer",
    enforce: "pre",
    async transform(code: string, id: string) {
      const templateRegex: RegExp = /<template>(.|\n)*?<\/template>/;
      if (!id.endsWith(".vue")) return;
      const template = code.match(templateRegex)?.[0] || "";
      return new Transpiler(template).transform(parentElementName || "div");
    },
  };
}
