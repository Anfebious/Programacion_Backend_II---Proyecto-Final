import BaseRouter from "./base.router.js"; // Adjust the path as necessary
import passportCall from "../utils/passportCall.js";
import HomeController from "../controllers/home.controller.js"; // Adjust the path as necessary
import { USER } from "../constants/roles.constant.js";

export default class HomeRouter extends BaseRouter {
    #homeController
    constructor() {
        super();
        this.#homeController = new HomeController();
    }

    // Override the initialize method to define routes
    initialize() {
        const router = this.getRouter();
        this.addGetRoute('/login', [], (req, res) => this.#homeController.renderLogin(req, res));
        this.addGetRoute("/current", [USER], (req, res) => this.#homeController.getCurrentUser(req, res));
        this.addGetRoute("/", [], (req, res) => this.#homeController.getAllProducts(req, res));
        this.addGetRoute("/real-time-products", [], (req, res) => this.#homeController.renderRealTimeProducts(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}