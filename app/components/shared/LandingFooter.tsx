"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useToast } from "@/app/components/shared/ToastContext";

const SOCIAL_LINKS = [
  { icon: FacebookRoundedIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: YouTubeIcon, label: "YouTube" },
  { icon: MusicNoteRoundedIcon, label: "TikTok" },
];

// "All Courses" and the Resources/Company columns now point at real routes
// (/courses, /resources, /about). Careers and Partnership have no corresponding
// page yet, so those two remain inert placeholders ("#") rather than fake destinations.
const FOOTER_COLUMNS: {
  titleKey: "coursesTitle" | "resourcesTitle" | "companyTitle";
  links: { labelKey: string; href: string }[];
}[] = [
  {
    titleKey: "coursesTitle",
    links: [
      { labelKey: "coursesAll", href: "/courses" },
      { labelKey: "coursesBeginner", href: "#" },
      { labelKey: "coursesIntermediate", href: "#" },
      { labelKey: "coursesAdvanced", href: "#" },
      { labelKey: "coursesBusiness", href: "#" },
    ],
  },
  {
    titleKey: "resourcesTitle",
    links: [
      { labelKey: "resourcesBlog", href: "/resources#blog" },
      { labelKey: "resourcesTips", href: "/resources#tips" },
      { labelKey: "resourcesEbooks", href: "/resources#ebooks" },
      { labelKey: "resourcesMaterials", href: "/resources#materials" },
      { labelKey: "resourcesFaq", href: "/resources#faq" },
    ],
  },
  {
    titleKey: "companyTitle",
    links: [
      { labelKey: "companyAbout", href: "/about" },
      { labelKey: "companyTeachers", href: "/about#team" },
      { labelKey: "companyCareers", href: "#" },
      { labelKey: "companyPartnership", href: "#" },
      { labelKey: "companyContact", href: "/about#contact" },
    ],
  },
];

export default function LandingFooter() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    showToast(t("landingFooter.newsletterSuccess"), "success");
    setEmail("");
  }

  return (
    <Box component="footer" sx={{ bgcolor: "action.hover" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "1.6fr repeat(3, 1fr) 1.4fr" },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ChatBubbleOutlineRoundedIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Learn <Box component="span" sx={{ color: "primary.main" }}>English</Box>
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 280 }}>
              {t("landingFooter.description")}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
              {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href="#"
                  aria-label={label}
                  size="small"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.text.primary, 0.06),
                    "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Box>

          {FOOTER_COLUMNS.map(({ titleKey, links }) => (
            <Box key={titleKey}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                {t(`landingFooter.${titleKey}`)}
              </Typography>
              <Stack spacing={1.25}>
                {links.map(({ labelKey, href }) => (
                  <Box
                    key={labelKey}
                    component={href.startsWith("/") ? Link : "a"}
                    href={href}
                    sx={{
                      fontSize: 14,
                      color: "text.secondary",
                      textDecoration: "none",
                      width: "fit-content",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {t(`landingFooter.${labelKey}`)}
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              {t("landingFooter.newsletterTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {t("landingFooter.newsletterDescription")}
            </Typography>
            <Box component="form" onSubmit={handleSubscribe}>
              <TextField
                size="small"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("landingFooter.newsletterPlaceholder")}
                sx={{ bgcolor: "background.paper", borderRadius: 999, "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" size="small" color="primary" aria-label={t("landingFooter.newsletterSubmit")}>
                          <SendRoundedIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "#0f172a", color: alpha("#ffffff", 0.8) }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ py: 2.5, alignItems: "center", justifyContent: "space-between", textAlign: "center" }}
          >
            <Typography variant="body2" sx={{ color: "inherit" }}>
              {t("landingFooter.copyright", { year: new Date().getFullYear() })}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography component="a" href="#" variant="body2" sx={{ color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                {t("landingFooter.termsOfUse")}
              </Typography>
              <Typography component="a" href="#" variant="body2" sx={{ color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                {t("landingFooter.privacyPolicy")}
              </Typography>
              <Typography component="a" href="#" variant="body2" sx={{ color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                {t("landingFooter.cookiePolicy")}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
