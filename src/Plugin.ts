import type { PluginOption } from "vite";

export default function vuelte(): PluginOption {
  return {
    name: "vite-vuelte-renderer",
    enforce: "pre",
    async transform(code: string, id: string) {
      if (!id.endsWith(".vue")) return;
      // console.log(
      //   code.replace(
      //     /<template>(.*?)<\/template>/,
      //     "<template><h1>JSGandalf</h1></template>"
      //   )
      // );
      console.log(id);
      code = code.replace(
        /<template>(.*?)<\/template>/,
        "<template><h1>JSGandalf</h1></template>"
      );
      return { code, map: null };
    },
  };
}
