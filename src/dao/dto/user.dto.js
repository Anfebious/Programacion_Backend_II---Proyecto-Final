import { createHash } from "../../utils/security.js";

export default class UserDTO {
    fromModel(model) {
        return {
            id: model._id,
            firstName: model.first_name,
            lastName: model.last_name,
            email: model.email,
            age: model.age,
            role: model.role,
        };
    }

    fromData(data) {
        return {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            age: data.age,
            role: data.role,
            password: data.password ? createHash(data.password) : null,
        };
    }
}