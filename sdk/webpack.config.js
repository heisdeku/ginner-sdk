// webpack.config.js
const path = require("path");

module.exports = {
  entry: {
    index: [
      path.resolve(__dirname, "utils.js"),
      path.resolve(__dirname, "script.js"),
    ],
  },
  output: {
    filename: "sdk-pay/v1/pay.js",
    path: path.resolve(__dirname),
  },
};
