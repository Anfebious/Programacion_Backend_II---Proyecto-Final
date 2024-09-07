import Product from './models/product.model.js';
class ProductDao {
    async createProduct(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            throw new Error('Error creating product: ${ error.message }');
        }
    }

    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            throw new Error('Error fetching product by ID: ${ error.message }');
        }
    }

    async updateProduct(productId, updateData) {
        try {
            return await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
        } catch (error) {
            throw new Error('Error updating product: ${ error.message }');
        }
    }

    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            throw new Error('Error deleting product: ${ error.message }');
        }
    }

    async getProductsPaginated(page = 1, limit = 10) {
        try {
            return await Product.paginate({}, { page, limit });
        } catch (error) {
            throw new Error('Error fetching paginated products: ${ error.message }');
        }
    }
}

export default new ProductDao();