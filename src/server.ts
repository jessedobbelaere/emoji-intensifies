import app from "./app";
import serverless from "serverless-http";

// Serverless-http allows us to 'wrap' our Express API for serverless use.
// No HTTP server, no ports or sockets. Just your code in the same execution pipeline you are already familiar with.
// @see https://github.com/dougmoscrop/serverless-http/blob/master/docs/ADVANCED.md#binary-mode
module.exports.handler = serverless(app, {
    binary: ["image/png", "image/gif"],
});
