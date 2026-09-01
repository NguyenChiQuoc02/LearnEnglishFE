"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import PaymentMethodDialog from "@/app/components/shared/PaymentMethodDialog";
import { useImagePreview } from "@/app/components/shared/ImagePreviewContext";
import { useToast } from "@/app/components/shared/ToastContext";
import { listCourses } from "@/app/services/course.service";
import { enrollCourse, listMyEnrollments } from "@/app/services/enrollment.service";
import { getMyWallet } from "@/app/services/wallet.service";
import type { CourseResponse, EnrollmentResponse } from "@/app/types";

const PAGE_SIZE = 8;

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

const SORT_OPTIONS = ["newest", "priceAsc", "priceDesc", "titleAsc"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const PLACEHOLDER_THUMBNAILS = [
  { icon: MenuBookRoundedIcon, bg: "#E0EAFF", fg: "#3B5BDB" },
  { icon: EditNoteRoundedIcon, bg: "#D3F9E4", fg: "#0F9D6E" },
  { icon: HeadphonesRoundedIcon, bg: "#FDE8D4", fg: "#E8590C" },
  { icon: GpsFixedRoundedIcon, bg: "#DCF0FF", fg: "#0B7BC4" },
  { icon: SchoolRoundedIcon, bg: "#EBE1FF", fg: "#7048E8" },
  { icon: ForumRoundedIcon, bg: "#FCE1F0", fg: "#D6336C" },
  { icon: SortByAlphaRoundedIcon, bg: "#FFF3CD", fg: "#D9970B" },
];

function CourseCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: "100%", borderRadius: 4, p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Skeleton variant="rounded" width={64} height={64} sx={{ borderRadius: 2.5, flexShrink: 0 }} />
        <Stack spacing={1} sx={{ justifyContent: "center" }}>
          <Skeleton variant="rounded" width={90} height={22} sx={{ borderRadius: 999 }} />
          <Skeleton variant="rounded" width={70} height={22} sx={{ borderRadius: 999 }} />
        </Stack>
      </Stack>
      <Skeleton variant="text" width="80%" height={28} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="rounded" height={44} sx={{ mt: 2.5, borderRadius: 2.5 }} />
    </Card>
  );
}

export default function CoursesCatalogPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { openImagePreview } = useImagePreview();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [enrollments, setEnrollments] = useState<Record<number, EnrollmentResponse>>({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [payingCourse, setPayingCourse] = useState<CourseResponse | null>(null);
  const [search, setSearch] = useState("");
  const [prevSearch, setPrevSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortAnchor, setSortAnchor] = useState<HTMLElement | null>(null);

  function loadCourses() {
    Promise.all([listCourses(), listMyEnrollments(), getMyWallet()])
      .then(([courseList, myEnrollments, wallet]) => {
        const sorted = [...courseList].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCourses(sorted);
        setEnrollments(
          Object.fromEntries(myEnrollments.map((e) => [e.courseId, e]))
        );
        setWalletBalance(wallet.balance);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : t("publicCourses.errorLoadCourses"))
      );
  }

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRefresh() {
    setError(null);
    setCourses(null);
    loadCourses();
  }

  function refreshEnrollments() {
    listMyEnrollments()
      .then((myEnrollments) => {
        setEnrollments(Object.fromEntries(myEnrollments.map((e) => [e.courseId, e])));
      })
      .catch(() => undefined);
    getMyWallet()
      .then((wallet) => setWalletBalance(wallet.balance))
      .catch(() => undefined);
  }

  async function handleEnroll(course: CourseResponse) {
    if (course.price > 0) {
      setPayingCourse(course);
      return;
    }
    setError(null);
    setEnrollingId(course.id);
    try {
      const enrollment = await enrollCourse(course.id);
      setEnrollments((prev) => ({ ...prev, [course.id]: enrollment }));
      showToast(t("publicCourses.enrollSuccess"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("publicCourses.errorEnroll"));
    } finally {
      setEnrollingId(null);
    }
  }

  const filteredCourses = useMemo(() => {
    if (!courses) return null;
    const query = search.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((course) => course.title.toLowerCase().includes(query));
  }, [courses, search]);

  const sortedCourses = useMemo(() => {
    if (!filteredCourses) return null;
    const list = [...filteredCourses];
    switch (sortBy) {
      case "priceAsc":
        return list.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return list.sort((a, b) => b.price - a.price);
      case "titleAsc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list;
    }
  }, [filteredCourses, sortBy]);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setPage(0);
  }

  const pageCount = sortedCourses
    ? Math.max(1, Math.ceil(sortedCourses.length / PAGE_SIZE))
    : 1;
  const currentPage = Math.min(page, pageCount - 1);

  const visibleCourses =
    sortedCourses?.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE) ?? [];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          py: { xs: 2.5, md: 3 },
          px: 2,
          borderRadius: 4,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center" }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("publicCourses.searchPlaceholder")}
            size="small"
            sx={{
              width: { xs: "100%", sm: 420 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: "background.paper",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Tooltip title={t("publicCourses.refresh")}>
            <span>
              <IconButton
                onClick={handleRefresh}
                disabled={!courses}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                  width: 44,
                  height: 44,
                }}
              >
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            }}
          >
            <MenuBookRoundedIcon sx={{ color: "primary.main" }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {t("publicCourses.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search.trim()
                ? t("publicCourses.searchResultsCount", {
                    count: filteredCourses?.length ?? 0,
                    query: search.trim(),
                  })
                : courses && courses.length > 0
                  ? t("publicCourses.subtitleCount", { count: courses.length })
                  : t("publicCourses.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          onClick={(e) => setSortAnchor(e.currentTarget)}
          startIcon={<SortRoundedIcon fontSize="small" />}
          endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
          sx={{
            flexShrink: 0,
            borderRadius: 2.5,
            bgcolor: "background.paper",
            borderColor: "divider",
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          {t(`publicCourses.sort.${sortBy}`)}
        </Button>
        <Menu anchorEl={sortAnchor} open={!!sortAnchor} onClose={() => setSortAnchor(null)}>
          {SORT_OPTIONS.map((option) => (
            <MenuItem
              key={option}
              selected={option === sortBy}
              onClick={() => {
                setSortBy(option);
                setSortAnchor(null);
              }}
            >
              {t(`publicCourses.sort.${option}`)}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {!courses && !error && (
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </Box>
      )}

      {courses && sortedCourses && sortedCourses.length > 0 && (
        <>
          <Fade in key={currentPage} timeout={300}>
            <Box
              sx={{
                display: "grid",
                gap: { xs: 2, md: 3 },
                justifyItems: "stretch",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
              }}
            >
              {visibleCourses.map((course) => {
                const enrollment = enrollments[course.id];
                const isEnrolling = enrollingId === course.id;
                const placeholder = PLACEHOLDER_THUMBNAILS[course.id % PLACEHOLDER_THUMBNAILS.length];
                const PlaceholderIcon = placeholder.icon;

                return (
                  <Card
                    key={course.id}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 4,
                      p: 2.5,
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      {course.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- remote Cloudinary URL, no next/image domain config in this project
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          onClick={() => openImagePreview(course.thumbnailUrl!, course.title)}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 14,
                            objectFit: "cover",
                            cursor: "zoom-in",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "14px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: placeholder.bg,
                          }}
                        >
                          <PlaceholderIcon sx={{ color: placeholder.fg, fontSize: 28 }} />
                        </Box>
                      )}

                      <Stack spacing={0.75} sx={{ justifyContent: "center" }}>
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                          <Chip
                            size="small"
                            label={course.courseType}
                            sx={{
                              fontWeight: 700,
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: (theme) => alpha(theme.palette.primary.main, 0.25),
                            }}
                          />
                          {course.level && (
                            <Chip
                              size="small"
                              label={t(`courseLevels.${course.level}`, course.level)}
                              sx={{
                                fontWeight: 700,
                                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                                color: "secondary.main",
                                border: "1px solid",
                                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.25),
                              }}
                            />
                          )}
                        </Stack>
                        <Box>
                          <Chip
                            size="small"
                            label={course.price > 0 ? formatVnd(course.price) : t("publicCourses.free")}
                            sx={{
                              fontWeight: 700,
                              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                              color: "secondary.main",
                              border: "1px solid",
                              borderColor: (theme) => alpha(theme.palette.secondary.main, 0.25),
                            }}
                          />
                        </Box>
                      </Stack>
                    </Stack>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description ?? t("publicCourses.noDescription")}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mt: 1.5, flexWrap: "wrap", rowGap: 0.5 }}>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <MenuBookRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {t("publicCourses.wordsCount", { count: course.totalWords })}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <PersonRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.teacherName}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Box sx={{ mt: "auto", pt: 2.5 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={isEnrolling}
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() =>
                          enrollment ? router.push(`/learn/${course.id}`) : handleEnroll(course)
                        }
                        sx={{ borderRadius: 2.5, fontWeight: 700, py: 1.1 }}
                      >
                        {enrollment
                          ? t("publicCourses.startLearning")
                          : isEnrolling
                            ? t("publicCourses.enrolling")
                            : course.price > 0
                              ? t("publicCourses.buyNow")
                              : t("publicCourses.enroll")}
                      </Button>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Fade>

          {pageCount > 1 && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", pt: 1 }}>
              <IconButton
                aria-label={t("publicCourses.prevPage")}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                size="small"
              >
                <ArrowBackIosNewRoundedIcon fontSize="small" />
              </IconButton>

              <Stack direction="row" spacing={1}>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <Box
                    key={i}
                    component="button"
                    onClick={() => setPage(i)}
                    aria-label={t("publicCourses.pageIndicator", { current: i + 1, total: pageCount })}
                    sx={{
                      width: i === currentPage ? 20 : 8,
                      height: 8,
                      borderRadius: 4,
                      border: "none",
                      cursor: "pointer",
                      bgcolor: i === currentPage ? "primary.main" : "action.disabled",
                      transition: "all 0.2s ease",
                      p: 0,
                    }}
                  />
                ))}
              </Stack>

              <IconButton
                aria-label={t("publicCourses.nextPage")}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={currentPage === pageCount - 1}
                size="small"
              >
                <ArrowForwardIosRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </>
      )}

      {courses?.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          {t("publicCourses.emptyNoCourses")}
        </Typography>
      )}

      {courses && courses.length > 0 && sortedCourses?.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          {t("publicCourses.emptyNoResults")}
        </Typography>
      )}

      {payingCourse && (
        <PaymentMethodDialog
          open
          course={payingCourse}
          walletBalance={walletBalance}
          onClose={() => setPayingCourse(null)}
          onPaid={() => {
            setPayingCourse(null);
            refreshEnrollments();
          }}
        />
      )}
    </Stack>
  );
}
