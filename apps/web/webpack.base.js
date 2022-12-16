const path = require("path");
const { merge } = require('webpack-merge');
const base = require('@gc-digital-talent/webpack-config/webpack.base.js');

const basePath = path.resolve(__dirname);

module.exports = merge(base(basePath), {
  entry: {
    app: [
      "./src/main.tsx",
      path.resolve(basePath, "../../frontend/common/src/css/hydrogen.css"),
      "../../frontend/common/src/css/common.css",
      "./src/assets/css/app.css",
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      '@common': path.resolve(__dirname, '../../frontend/common/src'),
    }
  },
  // TO DO: We should be able to remove this after merging all apps
  output: {
    publicPath: "/indigenous-it-apprentice", // final path for routing
    filename: "[name].[contenthash].js", // file hashing for cache busting
    chunkFilename: "[name].[contenthash].js", // file hashing for cache busting
    path: path.resolve(__dirname, "dist"), // output folder
    clean: true, // delete existing files on recompile
  },
});

