class TicketDTO {
    fromModel(model) {
        return {
            code: model.code,
            purchase_datetime: model.purchase_datetime,
            amount: model.amount,
            purchaser: model.purchaser,
        };
    }

    fromData(data) {
        return {
            code: data.code,
            purchase_datetime: data.purchase_datetime,
            amount: data.amount,
            purchaser: data.purchaser,
        };
    }
}

export default TicketDTO;