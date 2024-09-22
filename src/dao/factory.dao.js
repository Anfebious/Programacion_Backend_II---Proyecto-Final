import MongoDAO from "./mongodb/mongo.dao.js";
import { MONGODB } from "../constants/dao.constant.js";
import User from "./mongodb/model/user.model.js";
import Cart from "./mongodb/model/cart.model.js";
import Product from "./mongodb/model/product.model.js";
import Ticket from "./mongodb/model/ticket.model.js";

export default class FactoryDAO {
    createUser(className) {
        if (className === MONGODB) {
            return new MongoDAO(User);
        }
    }

    createCart(className) {
        if (className === MONGODB) {
            return new MongoDAO(Cart);
        }
    }

    createProduct(className) {
        if (className === MONGODB) {
            return new MongoDAO(Product);
        }
    }

    createTicket(className) {
        if (className === MONGODB) {
            return new MongoDAO(Ticket);
        }
    }
}