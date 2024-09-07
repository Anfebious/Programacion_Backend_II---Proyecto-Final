class ProductDto {
    constructor(product) {
        this._id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.stock = product.stock;
        this.status = product.status;
        this.availability = product.availability;
        this.category = product.category;
        this.thumbnail = product.thumbnail;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
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