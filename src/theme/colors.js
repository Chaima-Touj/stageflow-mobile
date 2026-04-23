export const colors = {
  primary: "#0D9488",
  primaryDark: "#0F766E",
  primaryLight: "#CCFBF1",

  bg: "#F0FDFA",
  bgCard: "#FFFFFF",
  bgSurface: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textWhite: "#FFFFFF",

  danger: "#EF4444",
  dangerLight: "#FEE2E2",

  border: "#E2E8F0",
};
export const getRoleColor = (role) => {
  switch (role) {
    case "étudiant":
      return { bg: "#DBEAFE", text: "#3B82F6" };
    case "entreprise":
      return { bg: "#EDE9FE", text: "#8B5CF6" };
    case "admin":
      return { bg: "#FEE2E2", text: "#EF4444" };
    case "encadrant":
      return { bg: "#D1FAE5", text: "#10B981" };
    default:
      return { bg: "#CCFBF1", text: "#0D9488" };
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "En attente":
      return { bg: "#FEF3C7", text: "#D97706", dot: "#F59E0B" };
    case "Acceptée":
      return { bg: "#D1FAE5", text: "#059669", dot: "#10B981" };
    case "Refusée":
      return { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444" };
    case "En cours":
      return { bg: "#DBEAFE", text: "#2563EB", dot: "#3B82F6" };
    default:
      return { bg: "#CCFBF1", text: "#0D9488", dot: "#0D9488" };
  }
};