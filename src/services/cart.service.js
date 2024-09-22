import CartRepository from "../repositories/cart.repository.js";
import TicketService from "./ticket.service.js";
import ProductService from "./product.service.js";

const ticketService = new TicketService();
const productService = new ProductService();

export default class CartService {
    #cartRepository;

    constructor() {
        this.#cartRepository = new CartRepository();
    }

    // Obtener todos los carritos aplicando filtros
    async findAll(paramFilters) {
        return await this.#cartRepository.findAll(paramFilters);
    }

    // Obtener un carrito por su ID
    async findOneById(id) {
        return await this.#cartRepository.findOneById(id);
    }

    // Crear un nuevo carrito
    async insertOne(data) {
        return await this.#cartRepository.save(data);
    }

    // Actualizar un carrito existente
    async updateOneById(id, data) {
        const cart = await this.findOneById(id);
        const newValues = { ...cart, ...data };
        return await this.#cartRepository.save(newValues);
    }

    // Eliminar un carrito por su ID
    async deleteOneById(id) {
        return await this.#cartRepository.deleteOneById(id);
    }

    // Agregar un producto a un carrito o incrementar la cantidad de un producto existente
    async addOneProduct(id, productId, quantity = 0) {
        const cart = await this.findOneById(id);
        const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await this.updateOneById(id, { products: cart.products });
    }

    // Eliminar un producto de un carrito o decrementar la cantidad de un producto existente
    async removeOneProduct(id, productId, quantity = 0) {
        const cart = await this.findOneById(id);
        const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

        if (productIndex < 0) {
            throw new Error(ERROR_NOT_FOUND_INDEX);
        }

        if (cart.products[productIndex].quantity > quantity) {
            cart.products[productIndex].quantity -= quantity;
        } else {
            cart.products.splice(productIndex, 1);
        }

        return await this.updateOneById(id, { products: cart.products });
    }

    // Eliminar todos los productos de un carrito por su ID
    async removeAllProducts(id) {
        return await this.updateOneById(id, { products: [] });
    }

    // Procesar la compra
    async purchase(id, user) {
        let cart = await this.findOneById(id);
        const updatedProducts = [];
        let quantityPurchased = 0;

        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                await productService.updateOneById(item.product._id, { ...item.product._doc });
                quantityPurchased += item.quantity;
            } else {
                updatedProducts.push({
                    product: item.product,
                    quantity: item.quantity,
                });
            }
        }

        cart = await this.updateOneById(cart.id, { products: updatedProducts });
        return ticketService.generateTicket(quantityPurchased, cart, user);
    }
}