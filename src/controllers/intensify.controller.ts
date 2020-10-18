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
        //console.log(event.body);

        const files = (await parser.parse(event)).files;
        if (!files || Object.keys(files).length === 0) {
            return CorsResponse({ message: "No files were uploaded." }, 400);
        }

        const uploadedFile = files[0];
        const animatedImage = await ImageTransformer.intensifyImage(uploadedFile);

        //return CorsResponse("Hello");

        // const resultImage = Buffer.from(
        //     "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",
        //     "base64",
        // );
        // //const resultImage = Buffer.from(animatedImage);
        // res.writeHead(200, {
        //     "Content-Type": "image/gif",
        //     "Content-disposition": "attachment;filename=" + "intensified.gif",
        //     "Content-Length": resultImage.length,
        // });
        // res.end(resultImage);

        // return CorsResponse(uploadedFile.content, 200, {
        //     "Content-Type": "image/png",
        //     "Content-disposition": "attachment;filename=" + "intensified.png",
        //     "Content-Length": uploadedFile.length,
        // });

        const resultImage = Buffer.from(
            "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",
            "base64",
        );
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/gif",
                "Content-disposition": "attachment;filename=" + "intensified.gif",
            },
            body: resultImage.toString("base64"),
            isBase64Encoded: true,
        };
    }
}
