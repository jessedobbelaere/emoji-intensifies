const path = require("path");
const slsw = require("serverless-webpack");

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
    mode: isLocal ? "development" : "production",
    entry: slsw.lib.entries,
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        libraryTarget: "commonjs2",
        path: path.join(__dirname, ".webpack"),
        filename: "[name].js",
    },
    target: "node", // Make sure node-specific assets are treated properly
    externals: ["aws-sdk"], // Don't bundle aws-sdk, so the import is handled by lambda at runtime (lambda already has aws-sdk available)
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
                include: [__dirname],
                exclude: /node_modules/,
            },
        ],
    },
};
