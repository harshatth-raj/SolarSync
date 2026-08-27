import api from "./api";

const getBySite = (siteId) => {
    return api.get(`/api/panels/site/${siteId}`);
};

const getById = (id) => {
    return api.get(`/api/panels/${id}`);
};

const createPanel = (panelData) => {
    return api.post("/api/panels", panelData);
};

const updatePanel = (id, panelData) => {
    return api.put(`/api/panels/${id}`, panelData);
};

const deletePanel = (id) => {
    return api.delete(`/api/panels/${id}`);
};

const panelService = {
    getBySite,
    getById,
    createPanel,
    updatePanel,
    deletePanel
};

export default panelService;