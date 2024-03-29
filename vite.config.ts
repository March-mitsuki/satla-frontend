import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import Pages from "vite-plugin-pages";

export default defineConfig({
  plugins: [
    solidPlugin(),
    Pages(),
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
