"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { LANGUAGES, type LanguageCode } from "@/app/constants/language.constants";
import { saveLanguage } from "@/app/utils/language-storage";

// "icon": plain globe icon button (used in app headers). "text": globe + language
// code + chevron (used on the public landing page to match its marketing-site nav).
export default function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "text" }) {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  function handleOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleSelect(language: LanguageCode) {
    handleClose();
    if (language === i18n.language) return;
    saveLanguage(language);
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }

  return (
    <>
      {variant === "text" ? (
        <ButtonBase
          onClick={handleOpen}
          sx={{ borderRadius: 999, px: 1, py: 0.5, gap: 0.5, color: "text.primary" }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <LanguageRoundedIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
              {i18n.language}
            </Typography>
            <ExpandMoreRoundedIcon fontSize="small" />
          </Stack>
        </ButtonBase>
      ) : (
        <Tooltip title={t("languageSwitcher.label")}>
          <IconButton onClick={handleOpen} color="inherit">
            <LanguageRoundedIcon />
          </IconButton>
        </Tooltip>
      )}

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
        {LANGUAGES.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={code === i18n.language}
            onClick={() => handleSelect(code)}
          >
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
