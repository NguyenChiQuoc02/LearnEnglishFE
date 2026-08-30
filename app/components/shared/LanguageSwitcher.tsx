"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { LANGUAGES, type LanguageCode } from "@/app/constants/language.constants";
import { saveLanguage } from "@/app/utils/language-storage";

export default function LanguageSwitcher() {
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
      <Tooltip title={t("languageSwitcher.label")}>
        <IconButton onClick={handleOpen} color="inherit">
          <LanguageRoundedIcon />
        </IconButton>
      </Tooltip>

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
