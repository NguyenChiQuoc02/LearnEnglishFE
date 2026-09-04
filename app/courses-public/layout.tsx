"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import ThemeModeToggle from "@/app/components/shared/ThemeModeToggle";
import UserMenu from "@/app/components/shared/UserMenu";
import { getAuth } from "@/app/utils/auth-storage";
import { usePageTitle } from "@/app/utils/usePageTitle";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useTranslation();
  usePageTitle(t("landing.navCourses"));

  useEffect(() => {
    if (!getAuth()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.appBar,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            href="/courses-public"
            variant="h6"
            sx={{ fontWeight: 800, flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            {t("publicCourses.brand")}
          </Typography>
          <ThemeModeToggle />
          <LanguageSwitcher />
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
    </Box>
  );
}
