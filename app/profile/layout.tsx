"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0} color="inherit" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title="Quay lại">
            <IconButton onClick={handleBack}>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            Learn English
          </Typography>
          <LanguageSwitcher />
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
    </Box>
  );
}
