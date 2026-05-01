import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
    base:
        process.env.DEPLOY_TARGET === "beta" ? "/point-incremental-beta" : "/",
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
    }
});
