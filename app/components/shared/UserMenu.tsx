"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTranslation } from "react-i18next";
import { clearAuth, useAuth } from "@/app/utils/auth-storage";

export default function UserMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  function handleAvatarClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleProfile() {
    handleMenuClose();
    router.push("/profile");
  }

  function handleWallet() {
    handleMenuClose();
    router.push("/wallet");
  }

  function handleLogout() {
    handleMenuClose();
    clearAuth();
    router.push("/login");
  }

  return (
    <>
      <Tooltip title={auth?.username ?? t("userMenu.account")}>
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              border: "2px solid",
              borderColor: "secondary.main",
            }}
          >
            {auth?.username?.[0]?.toUpperCase() ?? "?"}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {auth && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {auth.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {auth.email}
            </Typography>
          </Box>
        )}
        {auth && <Divider />}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("userMenu.profile")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleWallet}>
          <ListItemIcon>
            <AccountBalanceWalletRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("userMenu.wallet")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("userMenu.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
