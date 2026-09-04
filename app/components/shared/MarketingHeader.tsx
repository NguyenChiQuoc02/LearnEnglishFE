"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import { usePageTitle } from "@/app/utils/usePageTitle";

export type MarketingNavKey = "navHome" | "navPractice" | "navResources" | "navAbout";

const NAV_LINKS: { labelKey: MarketingNavKey; href: string }[] = [
  { labelKey: "navHome", href: "/" },
  { labelKey: "navPractice", href: "/practice" },
  { labelKey: "navResources", href: "/resources" },
  { labelKey: "navAbout", href: "/about" },
];

export default function MarketingHeader({ active }: { active: MarketingNavKey }) {
  const { t } = useTranslation();
  usePageTitle(t(`landing.${active}`));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: 1, borderColor: "divider" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.5, gap: 2 }}>
          <Stack
            component={Link}
            href="/"
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexShrink: 0, textDecoration: "none", color: "inherit" }}
          >
            <ChatBubbleOutlineRoundedIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>
              Learn <Box component="span" sx={{ color: "primary.main" }}>English</Box>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" }, mx: "auto" }}>
            {NAV_LINKS.map(({ labelKey, href }) => (
              <Box
                key={labelKey}
                component={Link}
                href={href}
                sx={{
                  fontSize: 15,
                  fontWeight: labelKey === active ? 600 : 500,
                  color: labelKey === active ? "primary.main" : "text.primary",
                  textDecoration: "none",
                  pb: 0.5,
                  borderBottom: 2,
                  borderColor: labelKey === active ? "primary.main" : "transparent",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {t(`landing.${labelKey}`)}
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexShrink: 0 }}>
            <LanguageSwitcher variant="text" />
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              sx={{ display: { xs: "none", sm: "inline-flex" }, borderRadius: 999 }}
            >
              {t("landing.login")}
            </Button>
            <Button component={Link} href="/register" variant="contained" sx={{ borderRadius: 999 }}>
              {t("landing.register")}
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
