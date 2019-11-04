const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css' ,
      chunkFilename: '[id].css' ,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false,
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },

          },
          'css-loader',
          // 'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist'),
  },
};