"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useTranslation } from "react-i18next";
import { DRAWER_WIDTH } from "./DashboardShell";

// Pinned to the top-left corner of the current dashboard screen (not inline with the
// page title), so it stays in a fixed, predictable spot regardless of how the page
// content below it is laid out (e.g. a centered form).
export default function BackButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("common.back")}>
      <IconButton
        onClick={onClick}
        sx={{
          position: "fixed",
          top: { xs: 108, sm: 76 },
          left: { xs: 12, sm: DRAWER_WIDTH + 16 },
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "background.paper", boxShadow: 4 },
        }}
      >
        <ArrowBackRoundedIcon />
      </IconButton>
    </Tooltip>
  );
}
