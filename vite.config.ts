import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import Pages from "vite-plugin-pages";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [
    solidPlugin(),
    Pages(),
    devtools({
      name: true,
    }),
  ],
  server: {
    port: 3131,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: [{ find: "@/", replacement: "/src/" }],
  },
});
