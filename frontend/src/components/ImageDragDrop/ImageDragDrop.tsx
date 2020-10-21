import React, { ReactElement, useState } from "react";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/url/dist/style.min.css";

export default function ImageDragDrop(): ReactElement {
    const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

    // Create an instance once and remember it for all rerenders
    const uppy = Uppy({
        restrictions: {
            maxFileSize: 200000, // 200 kB
            maxNumberOfFiles: 1,
            allowedFileTypes: ["image/png", "image/gif", "image/jpg", "image/jpeg"],
        },
        autoProceed: true,
        allowMultipleUploads: false,
    }).use(XHRUpload, {
        id: "XHRUpload",
        endpoint: "https://9al863jcci.execute-api.eu-central-1.amazonaws.com/prod/intensify",
        method: "POST",
        formData: true,
        responseType: "blob",
        fieldName: "emoji",
        headers: {
            Accept: "image/gif",
        },
        timeout: 10 * 1000, // 10 seconds timeout
        limit: 1, // 1 upload at a time,
        getResponseData: (responseText: any, response: any) => {
            // Return the entire XHR response because we work with blobs.
            // We also patch the xhr-upload package because it crashes on xhr.responseText
            // https://github.com/transloadit/uppy/issues/2434
            return response;
        },
    });

    uppy.on("complete", (result: any) => {
        const blob = result.successful[0].response.body.response;
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        setImageBlobUrl(url);
    });

    return (
        <div>
            {!imageBlobUrl && <Dashboard uppy={uppy} width="100%" theme="dark" note="Emoji images up to 200×200px" />}
            {imageBlobUrl && (
                <div>
                    <img src={imageBlobUrl} alt="intensified" />
                    <p>
                        <a className="another-one" href="/">
                            Upload another one?
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
