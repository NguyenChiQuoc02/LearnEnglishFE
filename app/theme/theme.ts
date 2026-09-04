import { createTheme } from "@mui/material/styles";
import { DEFAULT_PRIMARY_COLOR } from "@/app/constants/theme.constants";
import type { ThemeMode } from "@/app/utils/theme-color-storage";

export function createAppTheme(primaryColor: string = DEFAULT_PRIMARY_COLOR, mode: ThemeMode = "light") {
  return createTheme({
    cssVariables: true,
    typography: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: "#0ea5e9",
      },
      background:
        mode === "dark"
          ? { default: "#0f1115", paper: "#171a21" }
          : { default: "#f4f5f9" },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: ({ theme }) => ({ color: theme.palette.error.main }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          asterisk: ({ theme }) => ({ color: theme.palette.error.main }),
        },
      },
    },
  });
}

export default createAppTheme();
