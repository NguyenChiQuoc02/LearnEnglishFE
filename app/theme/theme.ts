import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#0ea5e9",
    },
    background: {
      default: "#f4f5f9",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
