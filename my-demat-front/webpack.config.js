
var webpack = require("webpack");
var path = require("path");
module.exports = {
	entry: path.resolve(__dirname,"src/application/typescript/app.module.ts"),
    output: {
        path: path.resolve(__dirname, "./src/dist2"),
      filename: "./src/dist2/bundle.js"
    },
	devtool: "source-map",
	watch: true
};