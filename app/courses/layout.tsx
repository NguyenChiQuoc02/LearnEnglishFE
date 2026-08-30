"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import UserMenu from "@/app/components/shared/UserMenu";
import { getAuth } from "@/app/utils/auth-storage";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!getAuth()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0} color="inherit" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            {t("publicCourses.brand")}
          </Typography>
          <LanguageSwitcher />
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
    </Box>
  );
}
