import { Context } from "aws-lambda";
import * as parser from "lambda-multipart-parser";
import { ImageTransformer } from "../transformers/image.transformer";

const CorsResponse = (obj, statusCode = 200, customHeaders = {}) => ({
    statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        ...customHeaders,
    },
    body: Buffer.isBuffer(obj) ? obj : JSON.stringify(obj),
});

export class IntensifyController {
    public async intensify(event: any, context?: Context) {
        console.log("functionName", context.functionName);

        // Fetch uploaded file from request
        const files = (await parser.parse(event)).files;
        if (!files || Object.keys(files).length === 0) {
            return CorsResponse({ message: "No files were uploaded." }, 400);
        }
        const uploadedFile = files[0];

        // Transform image to animated gif
        const animatedImage = await ImageTransformer.intensifyImage(uploadedFile);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/gif",
                "Content-disposition": "attachment;filename=" + "intensified.gif",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
            },
            body: animatedImage.toString("base64"),
            isBase64Encoded: true,
        };
    }
}
