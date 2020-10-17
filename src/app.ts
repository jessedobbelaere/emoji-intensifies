import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { Routes } from "./config/routes";

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config() {
        this.app.use(
            fileUpload({
                debug: true,
                limits: {
                    fileSize: 1 * 1024 * 1024 * 1024, //1 MB max file size
                },
            }),
        );

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
}

export default new App().app;
