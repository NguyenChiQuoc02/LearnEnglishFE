"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import ThemeColorPicker from "@/app/components/shared/ThemeColorPicker";
import UserMenu from "@/app/components/shared/UserMenu";
import { navItems } from "./nav-items";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="primary"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: alpha("#ffffff", 0.16),
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { sm: "none" } }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder={t("dashboardHeader.searchPlaceholder")}
          sx={{
            display: { xs: "none", md: "block" },
            width: 320,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              color: "primary.contrastText",
              bgcolor: alpha("#ffffff", 0.12),
              "& fieldset": { borderColor: alpha("#ffffff", 0.3) },
              "&:hover fieldset": { borderColor: alpha("#ffffff", 0.5) },
              "&.Mui-focused fieldset": { borderColor: "primary.contrastText" },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: alpha("#ffffff", 0.7),
              opacity: 1,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: alpha("#ffffff", 0.7) }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={t("dashboardHeader.help")}>
          <IconButton color="inherit">
            <HelpOutlineRoundedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("dashboardHeader.notifications")}>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <ThemeColorPicker />

        <LanguageSwitcher />

        <UserMenu />
      </Toolbar>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: { xs: "flex", sm: "none" },
          overflowX: "auto",
          px: 2,
          py: 1,
          bgcolor: "primary.main",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {navItems.map(({ labelKey, href, icon: Icon }) => {
          const selected = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

          return (
            <Chip
              key={href}
              component={Link}
              href={href}
              clickable
              icon={<Icon sx={{ fontSize: 18, color: "inherit !important" }} />}
              label={t(`dashboardNav.${labelKey}`)}
              sx={{
                flexShrink: 0,
                color: selected ? "primary.main" : "primary.contrastText",
                bgcolor: selected ? "common.white" : alpha("#ffffff", 0.16),
                fontWeight: 600,
                "&:hover": {
                  bgcolor: selected ? "common.white" : alpha("#ffffff", 0.26),
                },
              }}
            />
          );
        })}
      </Stack>
    </AppBar>
  );
}
