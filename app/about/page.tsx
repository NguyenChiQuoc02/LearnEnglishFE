"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import LandingFooter from "@/app/components/shared/LandingFooter";
import MarketingHeader from "@/app/components/shared/MarketingHeader";
import MarketingThemeProvider from "@/app/components/shared/MarketingThemeProvider";

const STATS: { icon: SvgIconComponent; value: string; labelKey: "statLearners" | "statCourses" | "statSatisfaction" | "statSupport"; color: string }[] = [
  { icon: Groups2RoundedIcon, value: "10,000+", labelKey: "statLearners", color: "#2563eb" },
  { icon: MenuBookRoundedIcon, value: "200+", labelKey: "statCourses", color: "#16a34a" },
  { icon: WorkspacePremiumRoundedIcon, value: "95%", labelKey: "statSatisfaction", color: "#d97706" },
  { icon: EmojiEventsRoundedIcon, value: "24/7", labelKey: "statSupport", color: "#7c3aed" },
];

const VALUES: { key: "learnerFirst" | "quality" | "community"; icon: SvgIconComponent; color: string }[] = [
  { key: "learnerFirst", icon: FavoriteRoundedIcon, color: "#dc2626" },
  { key: "quality", icon: WorkspacePremiumRoundedIcon, color: "#d97706" },
  { key: "community", icon: PublicRoundedIcon, color: "#0ea5e9" },
];

const TEAMS: ("curriculum" | "engineering" | "support" | "content")[] = [
  "curriculum",
  "engineering",
  "support",
  "content",
];

function AboutPageContent() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <MarketingHeader active="navAbout" />

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 6, md: 8 }, textAlign: "center" }}>
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 34, sm: 44, md: 52 }, lineHeight: 1.15 }}>
          {t("aboutPage.heroTitle")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontSize: 18, maxWidth: 680, mx: "auto" }}>
          {t("aboutPage.heroDescription")}
        </Typography>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/images/langdingpage.png"
            alt={t("landing.heroImageAlt")}
            sx={{ width: "100%", borderRadius: 4, objectFit: "cover", maxHeight: 360 }}
          />
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                }}
              >
                <RocketLaunchRoundedIcon />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {t("aboutPage.storyTitle")}
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {t("aboutPage.storyDescription")}
            </Typography>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
          }}
        >
          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
            {STATS.map(({ icon: Icon, value, labelKey, color }) => (
              <Stack key={labelKey} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    bgcolor: alpha(color, 0.12),
                    color,
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`landing.${labelKey}`)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Card>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center", mb: 4 }}>
          {t("aboutPage.valuesTitle")}
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
          {VALUES.map(({ key, icon: Icon, color }) => (
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
                  {t(`aboutPage.value.${key}Title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`aboutPage.value.${key}Description`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Typography id="team" variant="h4" sx={{ fontWeight: 800, textAlign: "center", mb: 4, scrollMarginTop: 96 }}>
          {t("aboutPage.teamTitle")}
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
          {TEAMS.map((key) => (
            <Card key={key} variant="outlined" sx={{ textAlign: "center", height: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 1.5,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 20,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    color: "primary.main",
                  }}
                >
                  {t(`aboutPage.team.${key}Name`).slice(0, 1)}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`aboutPage.team.${key}Name`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`aboutPage.team.${key}Role`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Card
          id="contact"
          variant="outlined"
          sx={{ borderRadius: 4, scrollMarginTop: 96 }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ justifyContent: "space-between" }}
            >
              <Box sx={{ maxWidth: 480 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {t("aboutPage.contactTitle")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t("aboutPage.contactDescription")}
                </Typography>
                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <EmailRoundedIcon fontSize="small" sx={{ color: "primary.main" }} />
                    <Typography variant="body2">{t("aboutPage.contactEmail")}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <LocationOnRoundedIcon fontSize="small" sx={{ color: "primary.main" }} />
                    <Typography variant="body2">{t("aboutPage.contactAddress")}</Typography>
                  </Stack>
                </Stack>
              </Box>
              <Stack spacing={2} sx={{ alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                  {t("aboutPage.contactCta")}
                </Typography>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ borderRadius: 999, px: 3 }}
                >
                  {t("aboutPage.contactButton")}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <LandingFooter />
    </Box>
  );
}

export default function AboutPage() {
  return (
    <MarketingThemeProvider>
      <AboutPageContent />
    </MarketingThemeProvider>
  );
}
