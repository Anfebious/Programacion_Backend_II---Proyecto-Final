import moment from "moment";
import CartService from "../services/cart.service.js";
import CartDto from "../dao/dto/cart.dto.js";
import { ERROR_SERVER } from "../constants/messages.constant.js";

class CartsController {
    constructor() {
        this.cartService = new CartService();
    }

    async getCartById(req, res) {
        try {
            const data = await this.cartService.findOneById(req.params.id);

            const cartDto = new CartDto().fromData(data);
            // Format the creation and update dates of the cart
            cartDto.createdAt = moment(cartDto.createdAt).format("YYYY-MM-DD HH:mm:ss");
            cartDto.updatedAt = moment(cartDto.updatedAt).format("YYYY-MM-DD HH:mm:ss");

            res.status(200).render("cart", { title: "Carrito", cart: cartDto });
        } catch (error) {
            // Use the custom error response
            res.sendError(new Error(ERROR_SERVER));
        }
    }
}

export default CartsController;