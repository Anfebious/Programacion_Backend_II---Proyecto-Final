import BaseRouter from "../base.router.js"; // Adjust the path as necessary
import ProductController from "../../controllers/product.controller.js"; // Adjust the path as necessary
import uploader from "../../utils/uploader.js";
import passportCall from "../../utils/passportCall.js";
import { ADMIN } from "../../constants/roles.constant.js";

export default class ProductRouter extends BaseRouter {
    #productController
    constructor() {
        super();
        this.#productController = new ProductController();
    }

    // Override the initialize method to define routes
    initialize() {
        const router = this.getRouter();
        this.addGetRoute("/", [], (req, res) => this.#productController.getAllProducts(req, res));
        this.addGetRoute("/:id", [], (req, res) => this.#productController.getProductById(req, res));
        this.addPostRoute("/", [ADMIN], (req, res) => this.#productController.createProduct(req, res));
        this.addPutRoute("/:id", [ADMIN], (req, res) => this.#productController.updateProduct(req, res));
        this.addDeleteRoute("/:id", [ADMIN], (req, res) => this.#productController.deleteProduct(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}