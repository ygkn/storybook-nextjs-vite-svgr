import { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/experimental-nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],

  viteFinal: (config) => {
    // add svgr support
    config.plugins = [
      ...config.plugins!,
      svgr({
        include: /\.svg$/,
      }),
    ];

    // HACK: To handle *.svg (without `?url`) imports, we need to modify the existing plugin: "vite-plugin-storybook-nextjs-image"
    // (set by @storybook/experimental-nextjs-vite)
    // Because this plugin doesn't have a option to exclude certain file types
    // TODO: Remove this workaround when the way to exclude certain file types is supported by the plugin
    config.plugins = config.plugins!.flat().map((plugin) => {
      if (
        typeof plugin === "object" &&
        plugin !== null &&
        "name" in plugin &&
        plugin.name === "vite-plugin-storybook-nextjs-image"
      ) {
        return {
          ...plugin,
          // the plugin handles *.svg by `resolveId` hook
          // see https://github.com/storybookjs/vite-plugin-storybook-nextjs/blob/b0e2b83ed5cfe666388a87a1935c9b511788eb16/src/plugins/next-image/plugin.ts#L54
          resolveId(id, importer) {
            // Skip .svg imports
            if (id.endsWith(".svg")) {
              return null;
            }

            // @ts-expect-error `resolveId` hook of vite-plugin-storybook-nextjs-image is a function
            return plugin.resolveId(id, importer);
          },
        };
      }
      return plugin;
    });

    // add tsconfig paths support
    config.plugins = [...config.plugins, tsconfigPaths()];

    return config;
  },
};
export default config;
