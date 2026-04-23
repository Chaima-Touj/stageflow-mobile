import { apiFetch } from "./client";

export const chatbotAPI = {
  send: (message, history = [], user = null) =>
    apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        history: history.filter((m) => m.sender !== "system").slice(-10),
        user: user ? { id: user._id, email: user.email, role: user.role } : null,
      }),
    }),

  sendFeedback: (messageId, rating, userId) =>
    apiFetch("/chat/feedback", {
      method: "POST",
      body: JSON.stringify({ messageId, rating, userId }),
    }),

  searchOffers: (keyword) =>
    apiFetch("/chat/offers", {
      method: "POST",
      body: JSON.stringify({ keyword }),
    }),
};