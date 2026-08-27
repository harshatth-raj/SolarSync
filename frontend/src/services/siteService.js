import api from "./api";

const getAll = () => {
    return api.get("/api/sites");
};

const getById = (id) => {
    return api.get(`/api/sites/${id}`);
};

const createSite = (siteData) => {
    return api.post("/api/sites", siteData);
};

const updateSite = (id, siteData) => {
    return api.put(`/api/sites/${id}`, siteData);
};

const deleteSite = (id) => {
    return api.delete(`/api/sites/${id}`);
};

const siteService = {
    getAll,
    getById,
    createSite,
    updateSite,
    deleteSite
};

export default siteService;