"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { getMyProfile } from "@/app/services/user.service";
import { useAuth } from "@/app/utils/auth-storage";
import { navItems } from "./nav-items";

const itemSx = (selected: boolean) => ({
  borderRadius: 2,
  mb: 0.5,
  position: "relative",
  color: alpha("#ffffff", 0.85),
  "& .MuiListItemIcon-root": {
    color: alpha("#ffffff", 0.7),
  },
  "&:hover": {
    bgcolor: alpha("#ffffff", 0.08),
  },
  ...(selected && {
    bgcolor: alpha("#000000", 0.28),
    color: "primary.contrastText",
    fontWeight: 700,
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 6,
      bottom: 6,
      width: 4,
      borderRadius: 4,
      bgcolor: "common.white",
    },
    "& .MuiListItemIcon-root": {
      color: "primary.contrastText",
    },
    "&:hover": {
      bgcolor: alpha("#000000", 0.34),
    },
  }),
});

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const auth = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    getMyProfile()
      .then((profile) => setAvatarUrl(profile.avatarUrl))
      .catch(() => setAvatarUrl(null));
  }, [auth]);

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      navItems.forEach((item) => {
        if (item.children?.some((child) => pathname?.startsWith(child.href))) {
          next[item.labelKey] = true;
        }
      });
      return next;
    });
  }, [pathname]);

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
        {navItems.map(({ labelKey, href, icon: Icon, children }) => {
          if (children?.length) {
            const isOpen = Boolean(openGroups[labelKey]);
            const groupSelected = children.some((child) => pathname?.startsWith(child.href));

            return (
              <Box key={labelKey}>
                <ListItemButton
                  onClick={() => setOpenGroups((prev) => ({ ...prev, [labelKey]: !prev[labelKey] }))}
                  sx={itemSx(groupSelected && !isOpen)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={t(`dashboardNav.${labelKey}`)} />
                  {isOpen ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {children.map((child) => {
                      const childSelected = pathname?.startsWith(child.href);
                      return (
                        <ListItemButton
                          key={child.href}
                          component={Link}
                          href={child.href}
                          selected={childSelected}
                          onClick={onNavigate}
                          sx={itemSx(Boolean(childSelected))}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <child.icon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={t(`dashboardNav.${child.labelKey}`)}
                            slotProps={{ primary: { sx: { fontSize: 14 } } }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          const selected = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

          return (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={selected}
              onClick={onNavigate}
              sx={itemSx(Boolean(selected))}
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
          <Avatar src={avatarUrl || undefined} sx={{ width: 40, height: 40, bgcolor: alpha("#ffffff", 0.2) }}>
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
