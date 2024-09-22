class ProductDto {
    fromModel(model) {
        return {
            _id: model._id,
            title: model.title,
            description: model.description,
            code: model.code,
            price: model.price,
            stock: model.stock,
            status: model.status,
            availability: model.availability,
            category: model.category,
            thumbnail: model.thumbnail,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    fromData(data) {
        return {
            id: data._id,
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            stock: data.stock,
            status: data.status,
            availability: data.availability,
            category: data.category,
            thumbnail: data.thumbnail,
        };
    }

    static fromCreateDto(data) {
        return {
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            stock: data.stock,
            status: data.status,
            availability: data.availability,
            category: data.category,
            thumbnail: data.thumbnail,
        };
    }

    static fromUpdateDto(data) {
        return {
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            stock: data.stock,
            status: data.status,
            availability: data.availability,
            category: data.category,
            thumbnail: data.thumbnail,
        };
    }
}

export default ProductDto;