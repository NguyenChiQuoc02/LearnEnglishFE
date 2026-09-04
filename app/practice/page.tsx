"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import LandingFooter from "@/app/components/shared/LandingFooter";
import MarketingHeader from "@/app/components/shared/MarketingHeader";
import MarketingThemeProvider from "@/app/components/shared/MarketingThemeProvider";

const MODES: { key: "vocabulary" | "listening" | "speaking" | "grammar" | "examPrep" | "leaderboard"; icon: SvgIconComponent; color: string }[] = [
  { key: "vocabulary", icon: SpellcheckRoundedIcon, color: "#2563eb" },
  { key: "listening", icon: HeadphonesRoundedIcon, color: "#16a34a" },
  { key: "speaking", icon: ChatBubbleRoundedIcon, color: "#d97706" },
  { key: "grammar", icon: ForumRoundedIcon, color: "#7c3aed" },
  { key: "examPrep", icon: GpsFixedRoundedIcon, color: "#0ea5e9" },
  { key: "leaderboard", icon: EmojiEventsRoundedIcon, color: "#dc2626" },
];

const STEPS: ("step1" | "step2" | "step3")[] = ["step1", "step2", "step3"];

function PracticePageContent() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <MarketingHeader active="navPractice" />

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 6, md: 8 }, textAlign: "center" }}>
        <Chip
          icon={<StarRoundedIcon fontSize="small" />}
          label={t("practicePage.heroBadge")}
          sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            fontWeight: 600,
            mb: 3,
            py: 2.4,
            "& .MuiChip-icon": { color: "primary.main" },
          }}
        />
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 34, sm: 44, md: 52 }, lineHeight: 1.15 }}>
          {t("practicePage.heroTitle")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, fontSize: 18, maxWidth: 640, mx: "auto" }}
        >
          {t("practicePage.heroDescription")}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
          <Button
            component={Link}
            href="/register"
            size="large"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ borderRadius: 999, px: 3 }}
          >
            {t("practicePage.ctaStart")}
          </Button>
          <Button component={Link} href="/courses" size="large" variant="outlined" sx={{ borderRadius: 999, px: 3 }}>
            {t("practicePage.ctaBrowseCourses")}
          </Button>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center" }}>
          {t("practicePage.modesTitle")}
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
          }}
        >
          {MODES.map(({ key, icon: Icon, color }) => (
            <Card key={key} variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: alpha(color, 0.12),
                    color,
                    mb: 1.5,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`practicePage.mode.${key}Name`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`practicePage.mode.${key}Description`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center" }}>
          {t("practicePage.howItWorksTitle")}
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          {STEPS.map((step, index) => (
            <Card key={step} variant="outlined" sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`practicePage.${step}Title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t(`practicePage.${step}Description`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          variant="outlined"
          sx={{
            mt: 5,
            borderRadius: 4,
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t("practicePage.ctaBannerTitle")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t("practicePage.ctaBannerDescription")}
                </Typography>
              </Box>
              <Button component={Link} href="/learn/demo" variant="contained" size="large" sx={{ borderRadius: 999 }}>
                {t("practicePage.ctaBannerButton")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <LandingFooter />
    </Box>
  );
}

export default function PracticePage() {
  return (
    <MarketingThemeProvider>
      <PracticePageContent />
    </MarketingThemeProvider>
  );
}
