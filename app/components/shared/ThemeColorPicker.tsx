"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { THEME_COLOR_PRESETS } from "@/app/constants/theme.constants";
import { useThemeColor } from "@/app/theme/ThemeColorContext";

export default function ThemeColorPicker() {
  const { t } = useTranslation();
  const { primaryColor, setPrimaryColor } = useThemeColor();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  function handleOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title={t("themeColorPicker.label")}>
        <ButtonBase
          onClick={handleOpen}
          aria-label={t("themeColorPicker.label")}
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: primaryColor,
            border: "2px solid",
            borderColor: "rgba(255,255,255,0.6)",
          }}
        />
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 260 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
            {t("themeColorPicker.label")}
          </Typography>

          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 1.5 }}>
            {THEME_COLOR_PRESETS.map((color) => (
              <ButtonBase
                key={color}
                onClick={() => setPrimaryColor(color)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: color,
                  border: "2px solid",
                  borderColor: color === primaryColor ? "text.primary" : "transparent",
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
            <Box
              component="input"
              type="color"
              value={primaryColor}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPrimaryColor(event.target.value)}
              sx={{
                width: 36,
                height: 36,
                border: "none",
                borderRadius: 1,
                p: 0,
                cursor: "pointer",
                bgcolor: "transparent",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {t("themeColorPicker.custom")}
            </Typography>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
