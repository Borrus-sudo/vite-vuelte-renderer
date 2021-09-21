import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuelte from "../../src/Plugin";
import Inspect from "vite-plugin-inspect";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Inspect(), vuelte(), vue()],
});
