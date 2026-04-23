import { apiFetch } from "./client";

export const usersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users${query ? "?" + query : ""}`);
  },
  getStats: () => apiFetch("/users/stats"),
  getEncadrants: () => apiFetch("/users/encadrants"),
  delete: (id) => apiFetch(`/users/${id}`, { method: "DELETE" }),
  assignSupervisor: (studentId, supervisorId) =>
    apiFetch(`/users/${studentId}/assign-supervisor`, {
      method: "PUT",
      body: JSON.stringify({ supervisorId }),
    }),
};