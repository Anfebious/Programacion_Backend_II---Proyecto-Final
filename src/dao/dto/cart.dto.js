class CartDto {
    fromModel(model) {
        return {
            id: model._id,
            products: model.products.map(item => ({
                product: item.product,
                quantity: item.quantity,
            })),
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    fromData(data) {
        return {
            id: data.id,
            products: data.products,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
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