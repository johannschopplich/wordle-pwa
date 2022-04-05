import { defineConfig } from "vite";
import { resolve } from "path";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },

  plugins: [
    Vue({
      reactivityTransform: true,
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
    Icons(),

    // https://github.com/unocss/unocss
    UnoCSS({
      transformers: [transformerDirective()],
    }),
  ],
});
