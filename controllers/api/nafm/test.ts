import * as eta from "../../../eta";
import * as db from "../../../db";
import Server from "../../../lib/Server";
@eta.mvc.route("/api/nafm/test")
@eta.mvc.controller()
export default class ApiNafmTestController extends eta.IHttpController {
    @eta.mvc.get()
    public async index(): Promise<void> {
        new Server();
    }
}
