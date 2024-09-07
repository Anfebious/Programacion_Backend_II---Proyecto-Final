class UserDto {
    constructor(user) {
        this._id = user._id;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.cart = user.cart;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static fromCreateDto(data) {
        return {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            age: data.age,
            password: data.password, // Password should be handled securely, not included in responses
            cart: data.cart,
            role: data.role || 'user', // Default to 'user' if role is not provided
        };
    }

    static fromUpdateDto(data) {
        const { password, ...updateData } = data; // Exclude password from the update data
        return updateData;
    }
}

export default UserDto;