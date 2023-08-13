import { resolve } from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { transformerDirectives } from "unocss";
import UnoCSS from "unocss/vite";
import VueDevTools from "vite-plugin-vue-devtools";

const currentDir = new URL(".", import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(currentDir, "src")}/`,
    },
  },

  plugins: [
    VueDevTools(),
    Vue({
      script: {
        propsDestructure: true,
      },
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      directoryAsNamespace: true,
      dts: "src/components.d.ts",
      resolvers: [
        // https://github.com/antfu/unplugin-icons
        IconsResolver({ prefix: false }),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({}),

    // https://github.com/unocss/unocss
    UnoCSS({
      transformers: [transformerDirectives()],
    }),
  ],
});
