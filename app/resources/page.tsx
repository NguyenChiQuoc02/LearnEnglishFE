"use client";

import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import LandingFooter from "@/app/components/shared/LandingFooter";
import MarketingHeader from "@/app/components/shared/MarketingHeader";
import MarketingThemeProvider from "@/app/components/shared/MarketingThemeProvider";

const BLOG_POSTS = ["post1", "post2", "post3"] as const;
const TIPS = ["tip1", "tip2", "tip3", "tip4"] as const;
const EBOOKS = ["ebook1", "ebook2", "ebook3"] as const;
const MATERIALS = ["material1", "material2", "material3"] as const;
const FAQS = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

function SectionHeading({ icon: Icon, title, id }: { icon: SvgIconComponent; title: string; id: string }) {
  return (
    <Stack id={id} direction="row" spacing={1.5} sx={{ alignItems: "center", scrollMarginTop: 96, mb: 3 }}>
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
          flexShrink: 0,
        }}
      >
        <Icon />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
    </Stack>
  );
}

function ResourcesPageContent() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <MarketingHeader active="navResources" />

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 5, md: 7 }, textAlign: "center" }}>
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 34, sm: 44, md: 52 }, lineHeight: 1.15 }}>
          {t("resourcesPage.heroTitle")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontSize: 18, maxWidth: 640, mx: "auto" }}>
          {t("resourcesPage.heroDescription")}
        </Typography>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 9 } }}>
        <SectionHeading icon={ArticleRoundedIcon} title={t("resourcesPage.blogTitle")} id="blog" />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          {BLOG_POSTS.map((key) => (
            <Card key={key} variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Chip
                  size="small"
                  label={t("resourcesPage.comingSoon")}
                  sx={{ fontWeight: 700, bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", mb: 1.5 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`resourcesPage.blog.${key}Title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t(`resourcesPage.blog.${key}Excerpt`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 9 } }}>
        <SectionHeading icon={LightbulbRoundedIcon} title={t("resourcesPage.tipsTitle")} id="tips" />
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" } }}>
          {TIPS.map((key) => (
            <Card key={key} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`resourcesPage.tips.${key}Title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t(`resourcesPage.tips.${key}Description`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 9 } }}>
        <SectionHeading icon={MenuBookRoundedIcon} title={t("resourcesPage.ebooksTitle")} id="ebooks" />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          {EBOOKS.map((key) => (
            <Card key={key} variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t(`resourcesPage.ebooks.${key}Title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t(`resourcesPage.ebooks.${key}Description`)}
                </Typography>
                <Chip
                  size="small"
                  label={t("resourcesPage.comingSoon")}
                  sx={{ fontWeight: 700, bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", mt: 1.5 }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 9 } }}>
        <SectionHeading icon={DownloadRoundedIcon} title={t("resourcesPage.materialsTitle")} id="materials" />
        <Stack spacing={1.5}>
          {MATERIALS.map((key) => (
            <Card key={key} variant="outlined">
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {t(`resourcesPage.materials.${key}Title`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`resourcesPage.materials.${key}Description`)}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={t("resourcesPage.comingSoon")}
                  sx={{ fontWeight: 700, bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", flexShrink: 0 }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <SectionHeading icon={ArticleRoundedIcon} title={t("resourcesPage.faqTitle")} id="faq" />
        <Stack spacing={1.5}>
          {FAQS.map((key) => (
            <Accordion key={key} variant="outlined" disableGutters sx={{ borderRadius: 3, "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Typography sx={{ fontWeight: 700 }}>{t(`resourcesPage.faq.${key}Question`)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{t(`resourcesPage.faq.${key}Answer`)}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>

      <LandingFooter />
    </Box>
  );
}

export default function ResourcesPage() {
  return (
    <MarketingThemeProvider>
      <ResourcesPageContent />
    </MarketingThemeProvider>
  );
}
