import ProductService from "../services/product.service.js";
import ProductDto from "../dao/dto/product.dto.js";
import { ERROR_INVALID_ID, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";

class ProductController {
    constructor() {
        this.productService = new ProductService();
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

    async getAllProducts(req, res) {
        try {
            const products = await this.productService.findAll(req.query);
            const productsDto = products.docs.map(product => new ProductDto().fromData(product));
            res.status(200).json({ status: true, payload: productsDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async getProductById(req, res) {
        try {
            const product = await this.productService.findOneById(req.params.id);
            const productDto = new ProductDto().fromData(product);
            res.status(200).json({ status: true, payload: productDto });
        } catch (error) {
            this.handleError(res, error.message);
        }
    }

    async createProduct(req, res) {
        if (req.user && req.user.role === "admin") {
            try {
                const { file } = req;
                const product = await this.productService.insertOne(req.body, file?.filename);
                const productDto = new ProductDto().fromData(product);
                res.status(201).json({ status: true, payload: productDto });
            } catch (error) {
                this.handleError(res, error.message);
            }
        } else {
            res.status(401).json({ message: "Unauthorized access" });
        }
    }

    async updateProduct(req, res) {
        if (req.user && req.user.role === "admin") {
            try {
                const { file } = req;
                const product = await this.productService.updateOneById(req.params.id, req.body, file?.filename);
                const productDto = new ProductDto().fromData(product);
                res.status(200).json({ status: true, payload: productDto });
            } catch (error) {
                this.handleError(res, error.message);
            }
        } else {
            res.status(401).json({ message: "Unauthorized access" });
        }
    }

    async deleteProduct(req, res) {
        if (req.user && req.user.role === "admin") {
            try {
                const product = await this.productService.deleteOneById(req.params.id);
                const productDto = new ProductDto().fromData(product);
                res.status(200).json({ status: true, payload: productDto });
            } catch (error) {
                this.handleError(res, error.message);
            }
        } else {
            res.status(401).json({ message: "Unauthorized access" });
        }
    }
}

export default ProductController;