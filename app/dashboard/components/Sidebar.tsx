"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { useAuth } from "@/app/utils/auth-storage";
import { navItems } from "./nav-items";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <SchoolRoundedIcon fontSize="large" />
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
          Learn English
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: alpha("#ffffff", 0.16) }} />
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {navItems.map(({ labelKey, href, icon: Icon }) => {
          const selected = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

          return (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={selected}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: alpha("#ffffff", 0.85),
                "& .MuiListItemIcon-root": {
                  color: alpha("#ffffff", 0.7),
                },
                "&:hover": {
                  bgcolor: alpha("#ffffff", 0.08),
                },
                "&.Mui-selected": {
                  bgcolor: alpha("#ffffff", 0.18),
                  color: "primary.contrastText",
                  fontWeight: 700,
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                  "&:hover": {
                    bgcolor: alpha("#ffffff", 0.24),
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={t(`dashboardNav.${labelKey}`)} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: alpha("#ffffff", 0.16) }} />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
            bgcolor: alpha("#ffffff", 0.08),
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Avatar sx={{ width: 40, height: 40, bgcolor: alpha("#ffffff", 0.2) }}>
            {auth?.username?.[0]?.toUpperCase() ?? "?"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
              {auth?.username ?? "—"}
            </Typography>
            <Typography variant="caption" noWrap sx={{ display: "block", color: alpha("#ffffff", 0.7) }}>
              {auth?.email ?? "—"}
            </Typography>
          </Box>
        </Box>
        <Button
          component={Link}
          href="/profile"
          onClick={onNavigate}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            color: "primary.contrastText",
            borderColor: alpha("#ffffff", 0.4),
            "&:hover": {
              borderColor: "primary.contrastText",
              bgcolor: alpha("#ffffff", 0.08),
            },
          }}
        >
          {t("sidebar.editProfile")}
        </Button>
      </Box>
    </Box>
  );
}
