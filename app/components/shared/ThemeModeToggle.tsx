"use client";

import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useThemeColor } from "@/app/theme/ThemeColorContext";

export default function ThemeModeToggle() {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeColor();
  const isDark = mode === "dark";
  const label = t(isDark ? "themeModeToggle.switchToLight" : "themeModeToggle.switchToDark");

  return (
    <Tooltip title={label}>
      <IconButton color="inherit" onClick={toggleMode} aria-label={label}>
        {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
