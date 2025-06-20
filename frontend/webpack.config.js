const path = require('path');

const sourcePath = path.resolve(__dirname, 'src/main/assets/js');
const govukFrontend = require(path.resolve(__dirname, 'webpack/govukFrontend'));
const scss = require(path.resolve(__dirname, 'webpack/scss'));
const HtmlWebpack = require(path.resolve(__dirname, 'webpack/htmlWebpack'));

const devMode = process.env.NODE_ENV !== 'production';
const fileNameSuffix = devMode ? '-dev' : '.[contenthash]';
const filename = `[name]${fileNameSuffix}.js`;

module.exports = {
  plugins: [...govukFrontend.plugins, ...scss.plugins, ...HtmlWebpack.plugins],
  entry: {
    main: path.resolve(sourcePath, 'index.ts'),
    'task-management': path.resolve(sourcePath, 'task-management/index.ts')
  },
  mode: devMode ? 'development' : 'production',
  module: {
    rules: [
      ...scss.rules,
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
            compilerOptions: {
              noEmitOnError: false
            }
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'src/main/public/'),
    publicPath: '',
    filename,
  },
};
