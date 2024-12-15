import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const baseRsbuildConfig = defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: (_, { rspack, appendPlugins }) => {
      appendPlugins([
        new rspack.ProvidePlugin({
          process: [require.resolve('process/browser')],
        }),
      ]);
    },
  },
});
export default baseRsbuildConfig;
