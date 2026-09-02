import axios from 'axios';

const BASE = '/api/sites';

const siteService = {
  getAll: () => axios.get(BASE),
  getById: (id) => axios.get(`${BASE}/${id}`),
  create: (data) => axios.post(BASE, data),
  update: (id, data) => axios.put(`${BASE}/${id}`, data),
  delete: (id) => axios.delete(`${BASE}/${id}`),
};

export default siteService;