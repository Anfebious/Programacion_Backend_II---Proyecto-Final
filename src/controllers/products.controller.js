import moment from "moment";
import ProductService from "../services/product.service.js";
import ProductDto from "../dao/dto/product.dto.js";
import { ERROR_SERVER } from "../constants/messages.constant.js";

class ProductsController {
    constructor() {
        this.productService = new ProductService();
    }

    async getProductByIdAndCartById(req, res) {
        try {
            const { id, rid: cartId } = req.params;
            const data = await this.productService.findOneById(id);
            const productDto = new ProductDto().fromData(data);

            productDto.createdAt = moment(productDto.createdAt).format("YYYY-MM-DD HH:mm:ss");
            productDto.updatedAt = moment(productDto.updatedAt).format("YYYY-MM-DD HH:mm:ss");
            productDto.currentCartId = cartId;
            productDto.id = id;

            res.status(200).render("product", { title: "Producto", product: productDto });
        } catch (error) {
            res.status(500).json({ status: false, message: ERROR_SERVER });
        }
    }
}

export default ProductsController;