import { Handler, Context } from "aws-lambda";
import { IntensifyController } from "./controllers/intensify.controller";

const controller = new IntensifyController();

export const intensify: Handler = (event: any, context: Context) => {
    return controller.intensify(event, context);
};
