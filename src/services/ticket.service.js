import TicketRepository from "../repositories/ticket.repository.js";

export default class TicketService {
    #ticketRepository;

    constructor() {
        this.#ticketRepository = new TicketRepository();
    }

    // Crear un nuevo ticket
    async insertOne(data) {
        return await this.#ticketRepository.save(data);
    }

    // Generar un ticket
    async generateTicket(quantity, cart, user) {
        if (cart.products.length === 0) {
            const newTicket = {
                amount: quantity,
                purchaser: user.email,
            };
            return await this.insertOne(newTicket);
        } else {
            return cart.products; // This might need adjustment based on your requirements
        }
    }
}