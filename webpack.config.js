module.exports = {
  entry: './src/main.ts',

  output: {
    filename: 'bundle.js',
  },

  mode: 'development',

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.ts'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
};
