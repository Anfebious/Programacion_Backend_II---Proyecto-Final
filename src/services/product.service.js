import ProductRepository from "../repositories/product.repository.js";
import { deleteFile } from "../utils/fileSystem.js";
import { convertToBoolean } from "../utils/converter.js";
import paths from "../utils/paths.js";

import {
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class ProductService {
    #productRepository;

    constructor() {
        this.#productRepository = new ProductRepository();
    }

    // Obtener todos los productos que coinciden opcionalmente con los filtros recibidos
    async findAll(paramFilters) {
        return await this.#productRepository.findAll(paramFilters);
    }

    // Obtener un producto por su ID
    async findOneById(id) {
        return await this.#productRepository.findOneById(id);
    }

    // Crear un nuevo producto
    async insertOne(data, filename) {
        const productData = {
            ...data,
            status: convertToBoolean(data.status),
            availability: convertToBoolean(data.availability),
            thumbnail: filename ? filename : data.thumbnail,
        };

        return await this.#productRepository.save(productData);
    }

    // Actualizar un producto por su ID
    async updateOneById(id, data, filename) {
        const product = await this.findOneById(id);
        const currentThumbnail = product.thumbnail;
        const newThumbnail = filename;

        const newValues = {
            ...data,
            status: convertToBoolean(data.status),
            availability: convertToBoolean(data.availability),
            thumbnail: newThumbnail ?? currentThumbnail,
        };

        try {
            const updatedProduct = await this.#productRepository.save(newValues);
            if (filename && newThumbnail !== currentThumbnail) {
                await deleteFile(paths.images, currentThumbnail);
            }
            return updatedProduct;
        } catch (error) {
            if (filename) await deleteFile(paths.images, filename);
            throw error;
        }
    }

    // Eliminar un producto por su ID
    async deleteOneById(id) {
        const product = await this.findOneById(id);
        if (product.thumbnail) {
            await deleteFile(paths.images, product.thumbnail);
        }
        return await this.#productRepository.deleteOneById(id);
    }
}