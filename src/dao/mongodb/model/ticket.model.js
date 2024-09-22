import { Schema, model } from "mongoose";
import crypto from 'crypto';

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return crypto.randomBytes(6).toString('hex').toUpperCase();
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const Ticket = model("tickets", ticketSchema);

export default Ticket;