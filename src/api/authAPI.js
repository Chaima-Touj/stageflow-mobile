import API from "./client";

export const authAPI = {
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await API.post("/auth/register", userData);
    return res.data;
  },

  getMe: async () => {
    const res = await API.get("/auth/me");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await API.put("/auth/profile", data);
    return res.data;
  },
};