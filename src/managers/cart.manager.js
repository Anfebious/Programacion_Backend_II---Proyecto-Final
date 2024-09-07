import mongoose from "mongoose";
import Cart from "../dao/mongo/models/cart.model.js";
import { isValidID } from "../config/mongoose.config.js";
import TicketManager from "./ticket.manager.js";
import ProductManager from "./product.manager.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
    ERROR_NOT_FOUND_INDEX,
} from "../constants/messages.constant.js";

const ticketManager = new TicketManager();
const productManager = new ProductManager();

export default class CartManager {
    #cart;

    constructor() {
        this.#cart = Cart;
    }

    // Maneja errores específicos de Mongoose (errores de validación)
    #handleError = (error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new Error(Object.values(error.errors)[0].message);
        }
        throw new Error(error.message);
    };

    // Valida que el ID proporcionado sea un ID válido de MongoDB
    #validateId = (id) => {
        if (!isValidID(id)) throw new Error(ERROR_INVALID_ID);
    };

    // Busca un carrito por su ID
    #findOneById = async (id) => {
        this.#validateId(id);

        const cartFound = await this.#cart.findOne({ _id: id }).populate("products.product");
        if (!cartFound) throw new Error(ERROR_NOT_FOUND_ID);

        return cartFound;
    };

    // Obtiene todos los carritos que coinciden opcionalmente con los filtros recibidos
    getAll = async (paramFilters) => {
        try {
            const paginationOptions = {
                limit: paramFilters?.limit ?? 10,
                page: paramFilters?.page ?? 1,
                populate: "products.product",
                lean: true,
            };

            // Busca y pagina todos los carritos poblando los productos
            const cartsFound = await this.#cart.paginate({}, paginationOptions);
            return cartsFound;
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Obtiene un carrito por su ID
    getOneById = async (id) => {
        try {
            const cartFound = await this.#findOneById(id);
            return cartFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Inserta un nuevo carrito
    insertOne = async (data) => {
        try {
            const cart = new Cart(data);

            await cart.save();
            return cart.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Actualiza un carrito por su ID
    updateOneById = async (id, data) => {
        try {
            console.log(id)
            console.log(data)
            const cartFound = await this.#findOneById(id);
            cartFound.set(data);
            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Elimina un carrito por su ID
    deleteOneById = async (id) => {
        try {
            const cartFound = await this.#findOneById(id);

            await this.#cart.deleteOne({ _id: cartFound._id });
            return cartFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Agrega un producto a un carrito o incrementar la cantidad de un producto existente
    addOneProduct = async (id, productId, quantity = 0) => {
        try {
            const cartFound = await this.#findOneById(id);

            const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cartFound.products[productIndex].quantity += quantity;
            } else {
                cartFound.products.push({ product: productId, quantity });
            }

            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Elimina un producto de un carrito o decrementa la cantidad de un producto existente
    removeOneProduct = async (id, productId, quantity = 0) => {
        try {
            const cartFound = await this.#findOneById(id);

            const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === productId);
            if (productIndex < 0) {
                throw new Error(ERROR_NOT_FOUND_INDEX);
            }

            if (cartFound.products[productIndex].quantity > quantity) {
                cartFound.products[productIndex].quantity -= quantity;
            } else {
                cartFound.products.splice(productIndex, 1);
            }

            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    // Elimina todos los productos de un carrito por su ID
    removeAllProducts = async (id) => {
        try {
            const cartFound = await this.#findOneById(id);
            cartFound.products = [];

            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    purchase = async (id, user) => {
        const cart = await this.#findOneById(id);
        const updatedProducts = [];
        let quantityPurchased = 0;
        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                // await item.product.save();
                await productManager.updateOneById(item.product._id, { ...item.product._doc }, null)
                quantityPurchased += item.quantity;
            } else {
                updatedProducts.push({
                    product: item.product,
                    quantity: item.quantity,
                });
            }
        }
        cart = await this.updateOneById(cart._id, updatedProducts)
        return ticketManager.generateTicket(quantityPurchased, cart, user);
    }
}