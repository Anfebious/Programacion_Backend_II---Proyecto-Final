import BaseRouter from "../base.router.js"; // Adjust the path as necessary
import passportCall from "../../utils/passportCall.js";
import CartController from "../../controllers/cart.controller.js"; // Adjust the path as necessary
import { USER } from "../../constants/roles.constant.js";


export default class CartRouter extends BaseRouter {
    #cartController
    constructor() {
        super();
        this.#cartController = new CartController();
    }

    // Override the initialize method to define routes
    initialize() {
        const router = this.getRouter();
        this.addGetRoute("/", [], (req, res) => this.#cartController.getAllCarts(req, res));
        this.addGetRoute("/:id", [], (req, res) => this.#cartController.getCartById(req, res));
        this.addPostRoute("/", [], (req, res) => this.#cartController.createCart(req, res));
        this.addPutRoute("/:id", [USER], (req, res) => this.#cartController.updateCart(req, res));
        this.addDeleteRoute("/:id", [], (req, res) => this.#cartController.deleteCart(req, res));
        this.addPutRoute("/:cid/products/:pid", [USER], (req, res) => this.#cartController.addProductToCart(req, res));
        this.addDeleteRoute("/:cid/products/:pid", [], (req, res) => this.#cartController.removeProductFromCart(req, res));
        this.addDeleteRoute("/:cid/products", [], (req, res) => this.#cartController.removeAllProductsFromCart(req, res));
        this.addPostRoute('/:cid/purchase', [USER], (req, res) => this.#cartController.purchaseCart(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}

