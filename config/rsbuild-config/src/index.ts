import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rsbuild/core';

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
export { defineConfig, baseRsbuildConfig };
export default baseRsbuildConfig;
