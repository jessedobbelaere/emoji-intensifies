import gm from "gm";
import { MultipartFile } from "../types/multipart-file.type";

// Make sure to have imagmagick (lambda layer) or with brew install imagemagick!
const im = gm.subClass({ imageMagick: true });

export class ImageTransformer {
    public static intensifyImage(image: MultipartFile): Promise<Buffer> {
        const { content: buffer } = image;
        const img = im(buffer).resize(20, 20).noProfile();

        // const img = im(buffer)
        //     .setFormat("png")
        //     .resize(30, 30, "^")
        //     .gravity("Center")

        //return Promise.resolve(new Buffer(30));
        return this.toBuffer(img);
    }

    public static toBuffer(img: gm.State): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            img.toBuffer("png", (err, buffer) => {
                if (err) return reject(err);

                return resolve(buffer);
            });
        });
    }
}
