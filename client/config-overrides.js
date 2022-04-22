const { useBabelRc, override, addWebpackAlias, addWebpackModuleRule } = require('customize-cra')
const path = require('path')
 
module.exports = override(
  useBabelRc(),
  addWebpackModuleRule({
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      { loader: 'babel-loader' },
      {
        loader: '@linaria/webpack-loader',
        options: {
          cacheDirectory: 'src/.linaria_cache',
          sourceMap: process.env.NODE_ENV !== 'production',
        },
      },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          experimentalWatchApi: true
        }
      }
    ],
  }),
  // 配置路径别名
  addWebpackAlias({
    "@": path.resolve(__dirname, 'src')
  })
)