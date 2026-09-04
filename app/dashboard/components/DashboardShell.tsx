"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { navItems } from "./nav-items";
import { getAuth, isAdmin } from "@/app/utils/auth-storage";
import { usePageTitle } from "@/app/utils/usePageTitle";

export const DRAWER_WIDTH = 260;

function getActiveNavLabelKey(pathname: string | null) {
  for (const item of navItems) {
    if (item.children?.some((child) => pathname?.startsWith(child.href))) {
      return item.children.find((child) => pathname?.startsWith(child.href))!.labelKey;
    }
    if (item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href)) {
      return item.labelKey;
    }
  }
  return "dashboard";
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  usePageTitle(t(`dashboardNav.${getActiveNavLabelKey(pathname)}`));

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.replace("/login");
    } else if (!isAdmin(auth)) {
      router.replace("/courses-public");
    }
  }, [router]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header onMenuClick={() => setMobileOpen((prev) => !prev)} />

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              border: "none",
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ display: { xs: "block", sm: "none" }, height: 48 }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
