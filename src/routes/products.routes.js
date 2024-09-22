import BaseRouter from "./base.router.js"; // Adjust the path as necessary
import ProductsController from "../controllers/products.controller.js"; // Adjust the path as necessary

export default class ProductsRouter extends BaseRouter {
    #productsController
    constructor() {
        super();
        this.#productsController = new ProductsController();
    }

    // Override the initialize method to define routes
    initialize() {
        const router = this.getRouter();
        this.addGetRoute("/:id/cart/:rid", [], (req, res) => this.#productsController.getProductByIdAndCartById(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}