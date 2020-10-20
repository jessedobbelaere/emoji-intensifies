import gm from "gm";
import tmp from "tmp";
import fs from "fs";
import { imageSize } from "image-size";
import { MultipartFile } from "../types/multipart-file.type";

// Make sure to have imagemagick (lambda layer) or with brew install imagemagick!
const im = gm.subClass({ imageMagick: true });

const defaultOptions: ImageTransformOptions = {
    frameCount: 10, // Number of frames of shaking
    delta: 6, // Max pixels to move while shaking
};

export interface ImageTransformOptions {
    frameCount?: number;
    delta?: number;
}

export class ImageTransformer {
    public static async intensifyImage(image: MultipartFile, options: ImageTransformOptions = {}): Promise<Buffer> {
        options = { ...defaultOptions, ...options };
        const { filename, content: buffer } = image;

        // Detect image size
        const { width, height } = imageSize(buffer);
        console.log(`Image ${filename} uploaded with dimensions ${width}x${height} and buffer size ${buffer.length}`);

        // Add 10% padding to our width and height, then scale to 128x128
        const img = im(buffer)
            .gravity("Center")
            .background("none")
            .extent(width + width / 10, height + height / 10)
            .geometry(128, 128);
        const imgBuffer = await this.toBuffer(img);

        // Generate some shaky frames
        const frames = [];
        for (let frameIndex = 0; frameIndex < options.frameCount; frameIndex++) {
            const xOffset = this.getRandomOffset(-options.delta, +options.delta);
            const yOffset = this.getRandomOffset(-options.delta, +options.delta);

            // Create a tmp object to write our gif frame to
            const tmpobj = tmp.fileSync({
                prefix: filename + "-frame" + frameIndex,
                postfix: ".gif",
            });
            const frameTmpFilename = await new Promise((resolve, reject) => {
                try {
                    im(imgBuffer)
                        .in("-page", `${xOffset}${yOffset}`)
                        .flatten()
                        .write(tmpobj.name, (err) => {
                            if (err) {
                                throw err;
                            }
                            resolve(tmpobj.name);
                        });
                } catch (err) {
                    reject(err);
                }
            });
            frames.push(frameTmpFilename);
        }

        // Combine the frames into an animated GIF
        // @ts-ignore
        const gifImg = im().in("-delay", "1x30").in("-loop", "0").in("-dispose", "Previous"); // Erase each previous frame before showing the next one
        frames.forEach((frame) => gifImg.in(frame));

        return this.toBuffer(gifImg).finally(() => this.removeTemporaryFiles(frames));
    }

    /**
     * Turn a gm state object into a Buffer
     */
    public static toBuffer(img: gm.State, imageFormat = "gif"): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            img.toBuffer(imageFormat, (err, buffer) => {
                if (err) return reject(err);

                return resolve(buffer);
            });
        });
    }

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    public static getRandomOffset(min: number, max: number): string {
        min = Math.ceil(min);
        max = Math.floor(max);
        const random = Math.floor(Math.random() * (max - min + 1)) + min;

        // Always ensure that our number is prefixed with "+" or "-" for GM to be used as offset
        // http://www.graphicsmagick.org/GraphicsMagick.html#details-page
        return (random < 0 ? "" : "+") + random;
    }

    /**
     * Cleanup the temporary files we created for our animated gif
     */
    public static removeTemporaryFiles(frames: string[]) {
        frames.forEach((frame) => fs.unlinkSync(frame));
    }
}
