const themes = {
  solarizedDark: {
    type: "dark",
    primary: { main: "#002b36", contrastText: "#eee8d5" },
    secondary: { main: "#eee8d5", contrastText: "#0e2a35" },
    background: { default: "#09232c", paper: "#002b36" },
  },
  solarizedLight: {
    type: "light",
    primary: { main: "#fff7dd", contrastText: "#002b36" },
    secondary: { main: "#002b36", contrastText: "#eee8d5" },
    background: { default: "#eee8d5", paper: "#fff7dd" },
  },
  light: {
    type: "light",
    primary: { main: "#f0f2f5", contrastText: "#000000" },
    secondary: { main: "#356fff", contrastText: "#ffffff" },
    background: { default: "#f0f2f5", paper: "#ffffff" },
  },
  dark: {
    type: "dark",
    primary: { main: "#282828", contrastText: "#ffffff" },
    secondary: { main: "#356fff", contrastText: "#ffffff" },
    background: { default: "#18191a", paper: "#242526" },
  },
};

export default themes;
