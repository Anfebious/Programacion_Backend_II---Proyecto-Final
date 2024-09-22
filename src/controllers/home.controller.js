import ProductService from "../services/product.service.js";
import UserDto from "../dao/dto/user.dto.js";
import ProductDto from "../dao/dto/product.dto.js";
import { ERROR_SERVER } from "../constants/messages.constant.js";

class HomeController {
    constructor() {
        this.productService = new ProductService();
        this.currentCartId = "66afb410c37231583bdbf367"; // Update as needed
    }

    async renderLogin(req, res) {
        const message = req.query.message || '';
        res.render('login', { message });
    }

    async getCurrentUser(req, res) {
        if (req.user) {
            const userDto = new UserDto().fromData(req.user);
            res.render("current", { user: userDto });
        } else {
            res.render("current", { user: null });
        }
    }

    async getAllProducts(req, res) {
        try {
            const data = await this.productService.getAll(req.query);
            const productsDto = data.docs.map(product => new ProductDto(product));

            const productsWithCartId = productsDto.map((productDto) => {
                return { ...productDto, currentCartId: this.currentCartId };
            });

            res.status(200).render("index", { title: "Inicio", data: productsWithCartId });
        } catch (error) {
            res.status(500).json({ status: false, message: ERROR_SERVER });
        }
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.status(200).render("realTimeProducts", { title: "Tiempo Real" });
        } catch (error) {
            res.status(500).json({ status: false, message: ERROR_SERVER });
        }
    }
}

export default HomeController;