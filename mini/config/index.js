const path = require('path')
const config = {
  projectName: 'mini',
  date: '2021-3-11',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  alias: {
    '@/actions': path.resolve(__dirname, '..', 'src/actions'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/constants': path.resolve(__dirname, '..', 'src/constants'),
    '@/config': path.resolve(__dirname, '..', 'src/config'),
    '@/images': path.resolve(__dirname, '..', 'src/images'),
    '@/hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@/libs': path.resolve(__dirname, '..', 'src/libs'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/reducers': path.resolve(__dirname, '..', 'src/reducers'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
  },
  defineConstants: {
  },
  copy: {
    patterns: [
      { from: 'theme.json', to: 'dist/theme.json' },
      { from: 'sitemap.json', to: 'dist/sitemap.json' },
      { from: 'src/images/icons/homeN.png', to: 'dist/images/icons/homeN.png' },
      { from: 'src/images/icons/homeY.png', to: 'dist/images/icons/homeY.png' },
      { from: 'src/images/icons/mineN.png', to: 'dist/images/icons/mineN.png' },
      { from: 'src/images/icons/mineY.png', to: 'dist/images/icons/mineY.png' },
      { from: 'src/images/icons/checkN.png', to: 'dist/images/icons/checkN.png' },
      { from: 'src/images/icons/checkY.png', to: 'dist/images/icons/checkY.png' },
      { from: 'src/images/icons/homeN_dark.png', to: 'dist/images/icons/homeN_dark.png' },
      { from: 'src/images/icons/homeY_dark.png', to: 'dist/images/icons/homeY_dark.png' },
      { from: 'src/images/icons/mineN_dark.png', to: 'dist/images/icons/mineN_dark.png' },
      { from: 'src/images/icons/mineY_dark.png', to: 'dist/images/icons/mineY_dark.png' },
      { from: 'src/images/icons/checkN_dark.png', to: 'dist/images/icons/checkN_dark.png' },
      { from: 'src/images/icons/checkY_dark.png', to: 'dist/images/icons/checkY_dark.png' },
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    webpackChain(chain, webpack) {
      chain.module
        .rule('script')
        .use('linariaLoader')
        .loader('@linaria/webpack-loader')
        .options({
          sourceMap: process.env.NODE_ENV !== 'production',
        })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    webpackChain(chain, webpack) {
      chain.module
        .rule('script')
        .use('linariaLoader')
        .loader('@linaria/webpack-loader')
        .options({
          sourceMap: process.env.NODE_ENV !== 'production',
        })
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
