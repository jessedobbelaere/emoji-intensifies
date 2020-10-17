import {IntensifyController } from "../controllers/intensify.controller"

export class Routes {
  public controller: IntensifyController = new IntensifyController();

  public routes(app): void {
    app.route("/intensify").post(this.controller.intensify);
  }
}
