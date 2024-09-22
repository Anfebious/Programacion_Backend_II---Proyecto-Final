import mongoose from "mongoose";
import Ticket from "../dao/mongodb/model/ticket.model.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
    ERROR_NOT_FOUND_INDEX,
} from "../constants/messages.constant.js";

export default class TicketManager {
    #ticket;
    constructor() {
        this.#ticket = Ticket;
    }
    #handleError = (error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new Error(Object.values(error.errors)[0].message);
        }
        throw new Error(error.message);
    };
    insertOne = async (data) => {
        try {
            const ticket = new Ticket(data);
            await ticket.save();
            return ticket.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };
    generateTicket = async (quantity, cart, user) => {
        if (cart.products.length == 0) {
            const newTicket = {
                amount: quantity,
                purchaser: user.email,
            }
            return this.insertOne(newTicket);
        } else {
            return cart.products;
        }
    }
}