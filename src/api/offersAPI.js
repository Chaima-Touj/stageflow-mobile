import { apiFetch } from "./client";

export const offersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/offers${query ? "?" + query : ""}`);
  },
  getOne: (id) => apiFetch(`/offers/${id}`),
  create: (data) => apiFetch("/offers", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/offers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/offers/${id}`, { method: "DELETE" }),
};