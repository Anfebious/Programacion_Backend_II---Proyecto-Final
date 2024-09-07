import { Router } from "express";
import moment from "moment";
import ProductManager from "../managers/product.manager.js";
import ProductDto from "../dao/dto/product.dto.js";

import {
    ERROR_SERVER,
} from "../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener un producto por su ID y mostrarlo en una vista
router.get("/:id/cart/:rid", async (req, res) => {
    try {
        const { id, rid: cartId } = req.params;
        const data = await productManager.getOneById(id);
        const productDto = new ProductDto(data)
        productDto.createdAt = moment(productDto.createdAt).format("YYYY-MM-DD HH:mm:ss");
        productDto.updatedAt = moment(productDto.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        productDto.currentCartId = cartId;
        res.status(200).render("product", { title: "Producto", productDto });
    } catch (error) {
        res.status(500).json({ status: false, ERROR_SERVER });
    }
});

export default router;