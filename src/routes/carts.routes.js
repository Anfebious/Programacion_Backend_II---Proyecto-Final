import BaseRouter from "./base.router.js"; // Adjust the path as necessary
import CartsController from "../controllers/carts.controller.js"; // Adjust the path as necessary

export default class CartRouter extends BaseRouter {
    #cartsController
    constructor() {
        super();
        this.#cartsController = new CartsController();
    }

    // Override the initialize method to define routes
    initialize() {
        const router = this.getRouter();
        this.addGetRoute("/:id", [], (req, res) => this.#cartsController.getCartById(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}