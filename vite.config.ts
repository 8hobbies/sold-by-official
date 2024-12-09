import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import yearPlugin from "@8hobbies/vite-plugin-year";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    author: pkg.author,
    homepage_url: pkg.homepage,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    webExtension({
      manifest: generateManifest,
    }),
    yearPlugin(),
  ],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest-setup.js"],
    coverage: {
      provider: "v8",
      exclude: [
        "dist/**",
        "eslint.config.mjs",
        "vite.config.ts",
        "src/background.ts",
        "src/popup.tsx",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
