"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import LandingFooter from "@/app/components/shared/LandingFooter";
import MarketingHeader from "@/app/components/shared/MarketingHeader";
import MarketingThemeProvider from "@/app/components/shared/MarketingThemeProvider";
import { getAuth, isAdmin } from "@/app/utils/auth-storage";

type CourseTrack = {
  nameKey: "vocabularyName" | "toeicName" | "ieltsName" | "vstepName";
  descriptionKey:
    | "vocabularyDescription"
    | "toeicDescription"
    | "ieltsDescription"
    | "vstepDescription";
  icon: SvgIconComponent;
};

const tracks: CourseTrack[] = [
  { nameKey: "vocabularyName", descriptionKey: "vocabularyDescription", icon: SpellcheckRoundedIcon },
  { nameKey: "toeicName", descriptionKey: "toeicDescription", icon: MenuBookRoundedIcon },
  { nameKey: "ieltsName", descriptionKey: "ieltsDescription", icon: RecordVoiceOverRoundedIcon },
  { nameKey: "vstepName", descriptionKey: "vstepDescription", icon: EmojiEventsRoundedIcon },
];

const STATS: {
  icon: SvgIconComponent;
  value: string;
  labelKey: "statLearners" | "statCourses" | "statSatisfaction" | "statSupport";
  color: string;
}[] = [
  { icon: Groups2RoundedIcon, value: "10,000+", labelKey: "statLearners", color: "#2563eb" },
  { icon: MenuBookRoundedIcon, value: "200+", labelKey: "statCourses", color: "#16a34a" },
  { icon: WorkspacePremiumRoundedIcon, value: "95%", labelKey: "statSatisfaction", color: "#d97706" },
  { icon: EmojiEventsRoundedIcon, value: "24/7", labelKey: "statSupport", color: "#7c3aed" },
];

function FeatureBadge({
  icon,
  color,
  title,
  description,
  sx,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        pr: 2,
        borderRadius: 3,
        maxWidth: 210,
        zIndex: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(color, 0.14),
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: "block" }}>
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}

// Hand-drawn-style underline under the script accent text, wider than the text itself.
function ScriptUnderline() {
  return (
    <Box
      component="svg"
      viewBox="0 0 220 20"
      sx={{ display: "block", width: "110%", height: 16, mt: 0.5, overflow: "visible" }}
    >
      <path
        d="M2 10 C 40 18, 120 18, 218 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Box>
  );
}

function LandingPageContent() {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      router.replace(isAdmin(auth) ? "/dashboard" : "/courses");
    }
  }, [router]);

  return (
    <Box id="top" sx={{ bgcolor: "background.default" }}>
      <MarketingHeader active="navHome" />

      {/* ---------- HERO ---------- */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { md: 600 },
        }}
      >
        {/* Hero image – absolutely positioned, right-aligned, full height */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "58%",
          }}
        >
          <Box
            component="img"
            src="/images/langdingpage.png"
            alt={t("landing.heroImageAlt")}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />

          {/* White cloud/fog gradient overlay – left edge fade */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "35%",
              background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Bottom fade */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "15%",
              background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />

          <FeatureBadge
            icon={<HeadphonesRoundedIcon fontSize="small" />}
            color="#2563eb"
            title={t("landing.featureListening")}
            description={t("landing.featureListeningDesc")}
            sx={{ top: "12%", left: "8%" }}
          />
          <FeatureBadge
            icon={<ChatBubbleRoundedIcon fontSize="small" />}
            color="#16a34a"
            title={t("landing.featureSpeaking")}
            description={t("landing.featureSpeakingDesc")}
            sx={{ top: "36%", right: "2%" }}
          />
          <FeatureBadge
            icon={<MenuBookRoundedIcon fontSize="small" />}
            color="#7c3aed"
            title={t("landing.featureVocabulary")}
            description={t("landing.featureVocabularyDesc")}
            sx={{ bottom: "22%", left: "12%" }}
          />
        </Box>

        {/* Text content – left side, full-bleed to left edge */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            py: { xs: 6, md: 10 },
            pl: { xs: 3, sm: 4, md: 6, lg: 8 },
            pr: { xs: 3, sm: 4, md: 2 },
            maxWidth: { md: "44%" },
          }}
        >
            <Chip
              icon={<StarRoundedIcon fontSize="small" />}
              label={t("landing.heroBadge")}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: 600,
                mb: 3,
                py: 2.4,
                "& .MuiChip-icon": { color: "primary.main" },
              }}
            />

            <Typography
              component="h1"
              sx={{ fontWeight: 800, fontSize: { xs: 40, sm: 48, md: 56 }, lineHeight: 1.1, letterSpacing: -1 }}
            >
              {t("landing.heroTitleLine1")}
              <br />
              {t("landing.heroTitleLine2")}
            </Typography>

            <Box sx={{ display: "inline-block", color: "primary.main" }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: '"Segoe Script", "Bradley Hand", "Brush Script MT", cursive',
                  fontSize: { xs: 44, sm: 52, md: 60 },
                  lineHeight: 1,
                  mt: 1,
                  display: "inline-block",
                }}
              >
                {t("landing.heroTitleScript")}
              </Typography>
              <ScriptUnderline />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 3, fontSize: 18, maxWidth: 480 }}>
              {t("landing.heroDescription")}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 4, flexWrap: "wrap", gap: 2 }}>
              <Button
                component={Link}
                href="/register"
                size="large"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ borderRadius: 999, px: 3 }}
              >
                {t("landing.ctaStart")}
              </Button>
              <Button component="a" href="#tracks" size="large" variant="outlined" sx={{ borderRadius: 999, px: 3 }}>
                {t("landing.ctaExplore")}
              </Button>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 5, alignItems: "center" }}>
              <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 34, height: 34, borderWidth: 2 } }}>
                <Avatar sx={{ bgcolor: "primary.light" }} />
                <Avatar sx={{ bgcolor: "success.light" }} />
                <Avatar sx={{ bgcolor: "secondary.light" }} />
                <Avatar sx={{ bgcolor: "warning.main", fontSize: 12, fontWeight: 700 }}>+4K</Avatar>
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary">
                {t("landing.socialProof")} 💙
              </Typography>
            </Stack>
        </Box>

        {/* Mobile hero image (stacked below text) */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "relative",
            width: "100%",
            mt: 2,
          }}
        >
          <Box
            component="img"
            src="/images/langdingpage.png"
            alt={t("landing.heroImageAlt")}
            sx={{ width: "100%", display: "block", borderRadius: 4 }}
          />
          <FeatureBadge
            icon={<HeadphonesRoundedIcon fontSize="small" />}
            color="#2563eb"
            title={t("landing.featureListening")}
            description={t("landing.featureListeningDesc")}
            sx={{ top: "8%", left: "10%" }}
          />
          <FeatureBadge
            icon={<ChatBubbleRoundedIcon fontSize="small" />}
            color="#16a34a"
            title={t("landing.featureSpeaking")}
            description={t("landing.featureSpeakingDesc")}
            sx={{ top: "38%", right: "-2%" }}
          />
          <FeatureBadge
            icon={<MenuBookRoundedIcon fontSize="small" />}
            color="#7c3aed"
            title={t("landing.featureVocabulary")}
            description={t("landing.featureVocabularyDesc")}
            sx={{ bottom: "28%", left: "-2%" }}
          />
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={6}
          sx={{
            mt: { xs: 4, md: -5 },
            borderRadius: 4,
            p: { xs: 3, md: 4 },
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
        </Paper>
      </Container>

      <Container id="tracks" maxWidth="lg" sx={{ pt: { xs: 4, md: 10 }, pb: { xs: 6, md: 10 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center" }}>
          {t("landing.tracksTitle")}
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          }}
        >
          {tracks.map(({ nameKey, descriptionKey, icon: Icon }) => (
            <Card key={nameKey} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    mb: 1.5,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`landing.track.${nameKey}`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`landing.track.${descriptionKey}`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container id="practice" maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Card variant="outlined" sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t("landing.rankingTitle")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t("landing.rankingDescription")}
                </Typography>
              </Box>
              <Button component={Link} href="/learn/demo" variant="contained" size="large" sx={{ borderRadius: 999 }}>
                {t("landing.rankingCta")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <LandingFooter />
    </Box>
  );
}

export default function Home() {
  return (
    <MarketingThemeProvider>
      <LandingPageContent />
    </MarketingThemeProvider>
  );
}
