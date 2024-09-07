import passportCall from "../../utils/passportCall.js"
import { Router } from "express";
import CartManager from "../../managers/cart.manager.js";
import CartDto from "../../dao/dto/cart.dto.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../../constants/messages.constant.js";

const router = Router();
const cartManager = new CartManager();

// Función para manejar los errores y devolver la respuesta adecuada
const handleError = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

// Ruta para obtener todos los carritos con la posibilidad de filtrar mediante query params
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll(req.query);
        const cartsDto = carts.docs.map(cart => new CartDto(cart))
        res.status(200).json({ status: true, payload: cartsDto });
    } catch (error) {
        handleError(res, error.message);
    }
});

// Ruta para obtener un carrito específico por su ID
router.get("/:id", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.id);
        const cartDto = new CartDto(cart)
        res.status(200).json({ status: true, payload: cartDto });
    } catch (error) {
        handleError(res, error.message);
    }
});

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.insertOne(req.body);
        const cartDto = new CartDto(cart)
        res.status(201).json({ status: true, payload: cartDto });
    } catch (error) {
        handleError(res, error.message);
    }
});

// Ruta para actualizar un carrito existente por su ID
router.put("/:id", passportCall("current"), async (req, res) => {
    if (req.user && req.user.role == "user") {
        try {
            const cart = await cartManager.updateOneById(req.params.id, req.body);
            const cartDto = new CartDto(cart)
            res.status(200).json({ status: true, payload: cartDto });
        } catch (error) {
            handleError(res, error.message);
        }
    } else {
        res.status(401).json({
            message: "Unauthorized access",
        });
    }
});

// Ruta para eliminar un carrito por su ID
router.delete("/:id", async (req, res) => {
    try {
        const cart = await cartManager.deleteOneById(req.params.id);
        const cartDto = new CartDto(cart)
        res.status(200).json({ status: true, payload: cartDto });
    } catch (error) {
        handleError(res, error.message);
    }
});

// Ruta para incrementar en una unidad o crear un producto específico en un carrito por su ID
router.put("/:cid/products/:pid", passportCall("current"), async (req, res) => {
    if (req.user && req.user.role == "user") {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await cartManager.addOneProduct(cid, pid, quantity ?? 1);
            const cartDto = new CartDto(cart)
            res.status(200).json({ status: true, payload: cartDto });
        } catch (error) {
            handleError(res, error.message);
        }
    } else {
        res.status(401).json({
            message: "Unauthorized access",
        });
    }
});

// Ruta para decrementar en una unidad o eliminar un producto específico en un carrito por su ID
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.removeOneProduct(cid, pid, 1);
        const cartDto = new CartDto(cart)
        res.status(200).json({ status: true, payload: cartDto });
    } catch (error) {
        handleError(res, error.message);
    }
});

// Ruta para eliminar todos los productos de un carrito específico
router.delete("/:cid/products", async (req, res) => {
    try {
        const cart = await cartManager.removeAllProducts(req.params.cid);
        const cartDto = new CartDto(cart)
        res.status(200).json({ status: true, payload: cartDto });
    } catch (error) {
        handleError(res, error.message);
    }
});

router.post('/:cid/purchase', passportCall("current"), async (req, res) => {
    if (req.user && req.user.role == "user") {
        try {
            const data = await cartManager.purchase(req.params.cid, req.user);
            res.status(200).json({ status: true, payload: data });
        } catch (error) {
            handleError(res, error.message);
        }
    } else {
        res.status(401).json({
            message: "Unauthorized access",
        });
    }
});

export default router;