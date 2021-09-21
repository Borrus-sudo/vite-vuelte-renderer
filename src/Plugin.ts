import { isDeepStrictEqual } from "util";
import type { PluginOption } from "vite";

export default function vuelte(): PluginOption {
  return {
    name: "vite-vuelte-renderer",
    enforce: "pre",
    async transform(code: string, id: string) {
      if (!id.endsWith(".vue")) return;
  
      return {
        code: code.replace(
          /<template>(.|\n)*?<\/template>/,
          "<template><h1>JSGandalf</h1></template>"
        ),
        map: null,
      };
    },
  };
}
