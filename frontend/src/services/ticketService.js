import api from "./api";

const getAll = () => {
    return api.get("/api/tickets");
};

const createTicket = (ticketData) => {
    return api.post("/api/tickets", ticketData);
};

const assignTicket = (ticketId, technicianId) => {
    return api.put(
        `/api/tickets/${ticketId}/assign`,
        null,
        {
            params: {
                technicianId
            }
        }
    );
};

const resolveTicket = (ticketId) => {
    return api.patch(
        `/api/tickets/${ticketId}/resolve`
    );
};

const ticketService = {
    getAll,
    createTicket,
    assignTicket,
    resolveTicket
};

export default ticketService;