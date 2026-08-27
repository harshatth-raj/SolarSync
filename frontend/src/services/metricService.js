import api from "./api";

const ingestBatch = (batchData) => {
    return api.post("/api/metrics/batch", batchData);
};

const getRecent = () => {
    return api.get("/api/metrics/recent");
};

const getAnalytics = () => {
    return api.get("/api/metrics/analytics");
};

const metricService = {
    ingestBatch,
    getRecent,
    getAnalytics
};

export default metricService;