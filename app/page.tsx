"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import SpellcheckRoundedIcon from "@mui/icons-material/SpellcheckRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
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
  {
    nameKey: "vocabularyName",
    descriptionKey: "vocabularyDescription",
    icon: SpellcheckRoundedIcon,
  },
  {
    nameKey: "toeicName",
    descriptionKey: "toeicDescription",
    icon: MenuBookRoundedIcon,
  },
  {
    nameKey: "ieltsName",
    descriptionKey: "ieltsDescription",
    icon: RecordVoiceOverRoundedIcon,
  },
  {
    nameKey: "vstepName",
    descriptionKey: "vstepDescription",
    icon: EmojiEventsRoundedIcon,
  },
];

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      router.replace(isAdmin(auth) ? "/dashboard" : "/courses");
    }
  }, [router]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar sx={{ py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            {t("landing.brand")}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <LanguageSwitcher />
            <Button component={Link} href="/login" variant="text">
              {t("landing.login")}
            </Button>
            <Button component={Link} href="/register" variant="contained">
              {t("landing.register")}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={3} sx={{ maxWidth: 640 }}>
          <Chip
            label={t("landing.heroChip")}
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start", fontWeight: 600 }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: 34, md: 48 } }}>
            {t("landing.heroTitle")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
            {t("landing.heroDescription")}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              href="/register"
              size="large"
              variant="contained"
            >
              {t("landing.ctaStart")}
            </Button>
            <Button component={Link} href="/login" size="large" variant="outlined">
              {t("landing.ctaHaveAccount")}
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
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

        <Card variant="outlined" sx={{ mt: { xs: 6, md: 10 } }}>
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
              <Button component={Link} href="/learn/demo" variant="contained" size="large">
                {t("landing.rankingCta")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
