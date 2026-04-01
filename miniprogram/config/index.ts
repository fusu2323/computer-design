import type { IConfig } from '@tarojs/taro'

const config: IConfig = {
  projectName: 'digital-inheritor',
  date: '2026-04-01',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-platform-weapp',
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: true,
  },
  mini: {
    compile: {
      exclude: [],
    },
    webpackChain(chain: any) {
      // Custom webpack config if needed
    },
  },
}

export default config
