import BaseRouter from "../base.router.js"; // Adjust the path as necessary
import passportCall from "../../utils/passportCall.js";
import SessionController from "../../controllers/session.controller.js"; // Adjust the path as necessary
import { generateToken } from "../../middlewares/auth.middleware.js";
import { USER } from "../../constants/roles.constant.js";



export default class SessionRouter extends BaseRouter {
    #sessionController
    constructor() {
        super();
        this.#sessionController = new SessionController();
    }

    // Override the initialize method to define routes
    initialize() {
        const router = this.getRouter();
        this.addGetRoute('/test', [], (req, res) => this.#sessionController.testAuth(req, res));
        this.addPostRoute('/login', [], generateToken, (req, res) => this.#sessionController.login(req, res));
        this.addGetRoute("/current", [USER], (req, res) => this.#sessionController.currentUser(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}