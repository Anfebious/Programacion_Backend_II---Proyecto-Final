class CartDto {
    constructor(cart) {
        this._id = cart._id;
        this.products = cart.products.map(item => ({
            product: item.product,
            quantity: item.quantity,
        }));
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    static fromCreateDto(data) {
        return {
            products: data.products,
        };
    }

    static fromUpdateDto(data) {
        return {
            products: data.products,
        };
    }
}

export default CartDto;