import CartService from "../services/cart.service.js";
import CartDto from "../dao/dto/cart.dto.js";
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    handleError(res, message) {
        if (message === ERROR_INVALID_ID) {
            return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
        }
        if (message === ERROR_NOT_FOUND_ID) {
            return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
        }
        return res.status(500).json({ status: false, message });
    }

    async getAllCarts(req, res) {
        try {
            const carts = await this.cartService.findAll(req.query);
            const cartsDto = carts.docs.map(cart => new CartDto().fromData(cart));
            res.status(200).json({ status: true, payload: cartsDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async getCartById(req, res) {
        try {
            const cart = await this.cartService.findOneById(req.params.id);
            const cartDto = new CartDto().fromData(cart);
            res.status(200).json({ status: true, payload: cartDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async createCart(req, res) {
        try {
            const cart = await this.cartService.insertOne(req.body);
            const cartDto = new CartDto().fromData(cart);
            res.status(201).json({ status: true, payload: cartDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async updateCart(req, res) {
        if (req.user && req.user.role === "user") {
            try {
                const cart = await this.cartService.updateOneById(req.params.id, req.body);
                const cartDto = new CartDto().fromData(cart);
                res.status(200).json({ status: true, payload: cartDto });
            } catch (error) {
                this.handleError(res, error.message);
            }
        } else {
            res.status(401).json({ message: "Unauthorized access" });
        }
    }

    async deleteCart(req, res) {
        try {
            const cart = await this.cartService.deleteOneById(req.params.id);
            const cartDto = new CartDto().fromData(cart);
            res.status(200).json({ status: true, payload: cartDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async addProductToCart(req, res) {
        if (req.user && req.user.role === "user") {
            try {
                const { cid, pid } = req.params;
                const { quantity } = req.body;
                const cart = await this.cartService.addOneProduct(cid, pid, quantity ?? 1);
                const cartDto = new CartDto().fromData(cart);
                res.status(200).json({ status: true, payload: cartDto });
            } catch (error) {
                this.handleError(res, error.message);
            }
        } else {
            res.status(401).json({ message: "Unauthorized access" });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const cart = await this.cartService.removeOneProduct(cid, pid, 1);
            const cartDto = new CartDto().fromData(cart);
            res.status(200).json({ status: true, payload: cartDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async removeAllProductsFromCart(req, res) {
        try {
            const cart = await this.cartService.removeAllProducts(req.params.cid);
            const cartDto = new CartDto().fromData(cart);
            res.status(200).json({ status: true, payload: cartDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async purchaseCart(req, res) {
        console.log("controller")
        if (req.user && req.user.role === "user") {
            try {
                const data = await this.cartService.purchase(req.params.cid, req.user);
                res.status(200).json({ status: true, payload: data });
            } catch (error) {
                this.handleError(res, error.message);
            }
        } else {
            res.status(401).json({ message: "Unauthorized access" });
        }
    }
}

export default CartController;