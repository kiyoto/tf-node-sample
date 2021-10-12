const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
    publicPath: "",
  },
  devtool: "source-map",
  externals: {
    express: "express",
  },
  resolve: {
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.(txt|html|css|json|yaml|yml)$/,
        type: "asset/source",
      },
    ],
  },
  output: {
    filename: "app.js",
    libraryTarget: "commonjs2",
  },
};
