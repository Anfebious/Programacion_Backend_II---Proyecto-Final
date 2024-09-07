import Cart from './models/cart.model.js';
class CartDao {
    async createCart(cartData) {
        try {
            const newCart = new Cart(cartData);
            return await newCart.save();
        } catch (error) {
            throw new Error('Error creating cart: ${ error.message }');
        }
    }

    async getCartById(cartId) {
        try {
            return await Cart.findById(cartId).populate('products.product');
        } catch (error) {
            throw new Error('Error fetching cart by ID: ${ error.message }');
        }
    }

    async updateCart(cartId, updateData) {
        try {
            return await Cart.findByIdAndUpdate(cartId, updateData, { new: true, runValidators: true });
        } catch (error) {
            throw new Error('Error updating cart: ${ error.message }');
        }
    }

    async deleteCart(cartId) {
        try {
            return await Cart.findByIdAndDelete(cartId);
        } catch (error) {
            throw new Error('Error deleting cart: ${ error.message }');
        }
    }

    async getCartsPaginated(page = 1, limit = 10) {
        try {
            return await Cart.paginate({}, { page, limit });
        } catch (error) {
            throw new Error('Error fetching paginated carts: ${ error.message }');
        }
    }
}

export default new CartDao();