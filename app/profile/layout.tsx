"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import ThemeModeToggle from "@/app/components/shared/ThemeModeToggle";
import UserMenu from "@/app/components/shared/UserMenu";
import { getAuth, isAdmin } from "@/app/utils/auth-storage";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getAuth()) {
      router.replace("/login");
    }
  }, [router]);

  function handleBack() {
    router.push(isAdmin(getAuth()) ? "/dashboard" : "/courses");
  }

  const homeHref = isAdmin(getAuth()) ? "/dashboard" : "/courses";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        elevation={0}
        color="primary"
        sx={{
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title="Quay lại">
            <IconButton onClick={handleBack} color="inherit">
              <ArrowBackRoundedIcon />
            </IconButton>
          </Tooltip>
          <Typography
            component={Link}
            href={homeHref}
            variant="h6"
            sx={{ fontWeight: 800, flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            Learn English
          </Typography>
          <ThemeModeToggle />
          <LanguageSwitcher />
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
    </Box>
  );
}
