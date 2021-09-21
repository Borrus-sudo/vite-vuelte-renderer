import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuelte from "../../src/Plugin";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuelte()],
});
