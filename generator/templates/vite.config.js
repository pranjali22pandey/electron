import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  root: fileURLToPath(new URL("./src/renderer", import.meta.url)), // Specify the root directory
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/renderer/src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use 'node_modules/@infineon/design-system-tokens/dist/tokens.scss' as tokens;`
       ,
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("ifx-"),
        },
      },
    }),
    eslintPlugin(),
  ],
  build: {
    outDir: fileURLToPath(new URL("./dist", import.meta.url)), // Output directory for the web build
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL("./src/renderer/index.html", import.meta.url)), // Entry point for the build
      output: {
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
      },
    },
  }
});
