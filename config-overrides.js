const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  const resolve = {
    fallback: {
      // Use can only include required modules. Also install the package.
      // for example: npm install --save-dev assert
      url: require.resolve("url"),
      fs: require.resolve("fs"),
      assert: require.resolve("assert"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
    },
  };
  config.resolve = resolve;
  config.plugins.push(new NodePolyfillPlugin());
  return config;
};
