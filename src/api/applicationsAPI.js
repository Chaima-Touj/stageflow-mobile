import { apiFetch } from "./client";

export const applicationsAPI = {
  getMy: () => apiFetch("/applications/my"),
  getAll: () => apiFetch("/applications"),
  getCompany: () => apiFetch("/applications/company"),

  apply: (offerId, motivation, cvFile) => {
    const formData = new FormData();
    formData.append("offerId", offerId);
    formData.append("motivation", motivation);
    if (cvFile) {
      formData.append("cv", {
        uri: cvFile.uri,
        type: cvFile.mimeType || "application/pdf",
        name: cvFile.name || "cv.pdf",
      });
    }
    return apiFetch("/applications", { method: "POST", body: formData });
  },

  updateStatus: (id, status) =>
    apiFetch(`/applications/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  assignSupervisor: (id, supervisorId) =>
    apiFetch(`/applications/${id}/supervisor`, {
      method: "PUT",
      body: JSON.stringify({ supervisorId }),
    }),

  delete: (id) => apiFetch(`/applications/${id}`, { method: "DELETE" }),
};