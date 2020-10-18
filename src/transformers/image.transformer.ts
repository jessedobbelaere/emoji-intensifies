import gm from "gm";
import tmp from "tmp";
import { imageSize } from "image-size";
import { MultipartFile } from "../types/multipart-file.type";

// Make sure to have imagmagick (lambda layer) or with brew install imagemagick!
const im = gm.subClass({ imageMagick: true });

const defaultOptions = {
    frameCount: 10, // Number of frames of shaking
    delta: 6, // Max pixels to move while shaking
};

export class ImageTransformer {
    public static async intensifyImage(image: MultipartFile, options = defaultOptions): Promise<Buffer> {
        const { filename, content: buffer } = image;

        // Detect image size
        const { width, height } = imageSize(buffer);
        console.log(`Image uploaded with dimensions ${width}x${height}`);

        // Add 10% padding to width and height, then scale to 128x128
        const img = im(buffer)
            .gravity("Center")
            .in("-background", " none")
            .extent(width + width / 10, height + height / 10)
            .geometry(128, 128);
        const imgBuffer = await this.toBuffer(img);

        // Generate some shaky frames
        const frames = [];
        for (let frameIndex = 0; frameIndex < options.frameCount; frameIndex++) {
            const x = this.getRandomXYNumber(-options.delta, +options.delta);
            const y = this.getRandomXYNumber(-options.delta, +options.delta);

            // Create a tmp object
            const tmpobj = tmp.fileSync({
                prefix: filename + "-frame" + frameIndex,
            });

            const frameTmpFilename = await new Promise((resolve, reject) => {
                try {
                    im(imgBuffer)
                        .in("-page", `${x}${y}`)
                        .flatten()
                        .write(tmpobj.name, (err, callback) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Writing", tmpobj.name);
                            resolve(tmpobj.name);
                        });
                } catch (err) {
                    reject(err);
                }
            });
            frames.push(frameTmpFilename);
        }

        // Combine the frames into a GIF
        console.log("Combining");
        let gifImg = im(imgBuffer);
        console.log(frames);
        frames.forEach((frame) => gifImg.in(frame));
        gifImg = gifImg.in("-delay", "1x30").in("-background", "none").dispose("Background").in("-loop", "0");
        //gifImg = gifImg.in("-background", "none").dispose("Background").in("-delay", "1x30").loop(0);
        return this.toBuffer(gifImg);
    }

    public static toBuffer(img: gm.State): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            img.toBuffer("gif", (err, buffer) => {
                if (err) return reject(err);

                return resolve(buffer);
            });
        });
    }

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    public static getRandomXYNumber(min: number, max: number): string {
        min = Math.ceil(min);
        max = Math.floor(max);
        const random = Math.floor(Math.random() * (max - min + 1)) + min;

        // Always ensure a "+" or "-" is prefixed
        return (random < 0 ? "" : "+") + random;
    }
}
