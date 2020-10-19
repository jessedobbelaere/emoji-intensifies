import React, { ReactElement } from "react";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/url/dist/style.min.css";

export default function ImageDragDrop(): ReactElement {
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
        limit: 1, // 1 upload at a time
    });

    uppy.on("complete", (result) => {
        console.log("COMPLETE");
        console.log(result);
    });

    return (
        <div>
            <Dashboard
                uppy={uppy}
                width="100%"
                theme="dark"
                note="Emoji images up to 200×200px"
                // locale={{
                //     strings: {
                //         // Text to show on the droppable area.
                //         // `%{browse}` is replaced with a link that opens the system file selection dialog.
                //         dropHereOr: "Drop emoji here or %{browse}",
                //         // Used as the label for the link that opens the system file selection dialog.
                //         browse: "browse",
                //     },
                // }}
            />
        </div>
    );
}
