import passportCall from "../utils/passportCall.js"
import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import UserDto from "../dao/dto/user.dto.js";
import ProductDto from "../dao/dto/product.dto.js";

import {
    ERROR_SERVER,
} from "../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();
const currentCartId = "66afb410c37231583bdbf367"; // Aquí coloca el ID del carrito creado en tu BD

router.get('/login', (req, res) => {
    const message = req.query.message || '';
    res.render('login', { message });
})

router.get("/current", passportCall("current"), (req, res) => {
    if (req.user) {
        const userDto = new UserDto(req.user);
        res.render("current", { user: userDto });
    } else {
        res.render("current", { user: null });
    }
});

// Ruta para obtener todos los productos con opciones de consulta y mostrar la vista principal
router.get("/", async (req, res) => {
    try {
        const data = await productManager.getAll(req.query);

        const productsDto = data.docs.map(product => new ProductDto(product));

        // Si se pasa un parámetro de ordenamiento, agrega a los datos para su uso en la vista
        const sortParam = req.query?.sort ? `&sort=${req.query.sort}` : "";

        // Añade el ID del carrito actual a cada producto en la lista de productos
        const productsWithCartId = productsDto.map((productDto) => {
            return { ...productDto, currentCartId };
        });

        productsWithCartId.currentCartId = currentCartId;
        res.status(200).render("index", { title: "Inicio", data: productsWithCartId });
    } catch (error) {
        res.status(500).json({ status: false, ERROR_SERVER });
    }
});

// Ruta para renderizar la vista de productos en tiempo real
router.get("/real-time-products", async (req, res) => {
    try {
        res.status(200).render("realTimeProducts", { title: "Tiempo Real" });
    } catch (error) {
        res.status(500).json({ status: false, ERROR_SERVER });
    }
});

export default router;