import { createTheme } from "@mui/material/styles";
import { DEFAULT_PRIMARY_COLOR } from "@/app/constants/theme.constants";

export function createAppTheme(primaryColor: string = DEFAULT_PRIMARY_COLOR) {
  return createTheme({
    cssVariables: true,
    typography: {
      fontFamily: '"Times New Roman", Times, serif',
    },
    palette: {
      primary: {
        main: primaryColor,
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
}

export default createAppTheme();
