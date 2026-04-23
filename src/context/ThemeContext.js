import React, { createContext, useContext, useState } from "react";

// ─── DARK THEME ───────────────────────────────────────────────
const dark = {
  mode: "dark",
  accent:        "#00FF94",
  accentDim:     "rgba(0,255,148,0.12)",
  accentBorder:  "rgba(0,255,148,0.25)",

  bg:            "#070B14",
  bgCard:        "#0F1827",
  bgElevated:    "#162032",
  bgInput:       "#0C1520",

  text:          "#F0F6FF",
  textSub:       "#7B91B0",
  textMuted:     "#3D5068",

  border:        "#1A2A3F",
  borderLight:   "#243347",

  danger:        "#FF4D6A",
  dangerDim:     "rgba(255,77,106,0.12)",
  success:       "#00D68F",
  successDim:    "rgba(0,214,143,0.12)",
  warning:       "#FFB020",
  warningDim:    "rgba(255,176,32,0.12)",
  info:          "#3D8EFF",
  infoDim:       "rgba(61,142,255,0.12)",

  tabBar:        "#080D18",
  statusBar:     "light-content",
};

// ─── LIGHT THEME ──────────────────────────────────────────────
const light = {
  mode: "light",
  accent:        "#00B86B",
  accentDim:     "rgba(0,184,107,0.10)",
  accentBorder:  "rgba(0,184,107,0.22)",

  bg:            "#F0F5FF",
  bgCard:        "#FFFFFF",
  bgElevated:    "#E8EEF8",
  bgInput:       "#F5F8FF",

  text:          "#0D1B2E",
  textSub:       "#5A6E8A",
  textMuted:     "#A0B0C5",

  border:        "#DDE5F0",
  borderLight:   "#EBF0F8",

  danger:        "#E5314A",
  dangerDim:     "rgba(229,49,74,0.10)",
  success:       "#00A86B",
  successDim:    "rgba(0,168,107,0.10)",
  warning:       "#E59A00",
  warningDim:    "rgba(229,154,0,0.10)",
  info:          "#2563EB",
  infoDim:       "rgba(37,99,235,0.10)",

  tabBar:        "#FFFFFF",
  statusBar:     "dark-content",
};

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? dark : light;
  const toggleTheme = () => setIsDark(p => !p);
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);