import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import devConfig from './dev';
import prodConfig from './prod';
import pkgJson from '../package.json';
import path from 'path';
const packagesDir = path.resolve(__dirname, '../../');

const isProduction = process.env.NODE_ENV === 'production';
const isBuildNative = process.env.BUILD_NATIVE === 'true';
const isWeapp = process.env.TARO_ENV === 'weapp';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async merge => {
  const baseConfig: UserConfigExport = {
    projectName: 'chat',
    date: '2024-10-30',
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: isProduction
      ? `dist/lib-${process.env.TARO_ENV}`
      : `dist_dev/${process.env.TARO_ENV}`,
    // 原生微信小程序组件场景不支持这个插件
    plugins: isBuildNative && isWeapp ? [] : ['@tarojs/plugin-http'],
    env: {
      BUILD_NATIVE: JSON.stringify(`${isBuildNative}`),
    },
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false,
      },
    },
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 1024, // 设定转换尺寸上限
          },
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        chain.module
          .rule('coze_api')
          .test(/\.(js|mjs)$/)
          .include.add(/node_modules\//)
          .end()
          .use('babel-loader')
          .loader('babel-loader');
        chain.module
          .rule('taroApiBabel')
          .test(/\.ts$/)
          .use('babel-loader')
          .loader('babel-loader')
          .end()
          .include.add(packagesDir);
        chain.resolve.alias.set(
          '@tarojs/plugin-framework-react',
          path.resolve(
            __dirname,
            '../node_modules/@tarojs/plugin-framework-react',
          ),
        );

        if (isBuildNative && isWeapp) {
          chain.output.publicPath(`/miniprogram_npm/${pkgJson.name}/`);
        }
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: isBuildNative
        ? {
            /* filename: (pathData, assetInfo) => {
              console.log(
                'pathData, assetInfo:',
                pathData.filename,
                pathData.basename,
                pathData.url,
                assetInfo,
              );
              return 'exports/index.js';
            },*/
            chunkLoadingGlobal: `webpackJsonp_coze_chat_sdk`,
          }
        : undefined,

      miniCssExtractPluginOption: isBuildNative
        ? {
            ignoreOrder: true,
            //filename: 'exports/index.css',
          }
        : undefined,
      imageUrlLoaderOption: {
        limit: 1024 * 40,
      },
      postcss: {
        pxtransform: {
          enable: false,
          config: {},
        },
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },

      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        chain.module
          .rule('coze_api')
          .test(/\.(js|mjs)$/)
          .use('babel-loader')
          .loader('babel-loader');
        chain.resolve.alias.set(
          '@tarojs/plugin-framework-react',
          path.resolve(
            __dirname,
            '../node_modules/@tarojs/plugin-framework-react',
          ),
        );
        //chain.output.jsonpFunction(`webpackJsonp_${pkgJson.name}`);
        chain.module
          .rule('taroApiBabel')
          .test(/\.ts$/)
          .use('babel-loader')
          .loader('babel-loader')
          .end()
          .include.add(packagesDir);
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }

  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
