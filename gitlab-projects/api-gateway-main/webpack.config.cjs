const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./server.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  resolve: {
    fallback: {
      assert: require.resolve("assert/"),
      zlib: require.resolve("browserify-zlib"),
      querystring: require.resolve("querystring-es3"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
      util: require.resolve("util/"),
      vm: require.resolve("vm-browserify"),
      net: require.resolve("net"),
      "pg-hstore": require.resolve("pg-hstore"),
      process: require.resolve("process/browser"),
    },
    extensions: [".js", ".json"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
