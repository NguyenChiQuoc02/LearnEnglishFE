"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PaymentMethodDialog from "@/app/components/shared/PaymentMethodDialog";
import { useToast } from "@/app/components/shared/ToastContext";
import { listCourses } from "@/app/services/course.service";
import { enrollCourse, listMyEnrollments } from "@/app/services/enrollment.service";
import { getMyWallet } from "@/app/services/wallet.service";
import type { CourseResponse, EnrollmentResponse } from "@/app/types";
import type { CourseLevel } from "@/app/constants/course.constants";

const PAGE_SIZE = 8;

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

const LEVEL_COLOR: Record<CourseLevel, "success" | "warning" | "error"> = {
  BEGINNER: "success",
  INTERMEDIATE: "warning",
  ADVANCED: "error",
};

function CourseCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
          <Skeleton variant="rounded" width={40} height={40} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={56} height={22} />
            <Skeleton variant="rounded" width={64} height={22} />
          </Stack>
        </Stack>
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
        <Skeleton variant="rounded" height={40} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );
}

export default function CoursesCatalogPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [enrollments, setEnrollments] = useState<Record<number, EnrollmentResponse>>({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [payingCourse, setPayingCourse] = useState<CourseResponse | null>(null);
  const [search, setSearch] = useState("");
  const [prevSearch, setPrevSearch] = useState("");
  const [page, setPage] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setHeaderHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  if (search !== prevSearch) {
    setPrevSearch(search);
    setPage(0);
  }

  const pageCount = filteredCourses
    ? Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE))
    : 1;
  const currentPage = Math.min(page, pageCount - 1);

  const visibleCourses =
    filteredCourses?.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE) ?? [];

  return (
    <Stack spacing={3}>
      <Box
        ref={headerRef}
        sx={{
          position: "fixed",
          top: { xs: 56, sm: 64 },
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          textAlign: "center",
          py: { xs: 1.5, md: 2 },
          px: 2,
          backgroundColor: "background.default",
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}1A, ${theme.palette.secondary.main}1A)`,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t("publicCourses.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {search.trim()
            ? t("publicCourses.searchResultsCount", {
                count: filteredCourses?.length ?? 0,
                query: search.trim(),
              })
            : courses && courses.length > 0
              ? t("publicCourses.subtitleCount", { count: courses.length })
              : t("publicCourses.subtitle")}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: "center", justifyContent: "center" }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("publicCourses.searchPlaceholder")}
            size="small"
            sx={{
              width: { xs: "100%", sm: 320 },
              bgcolor: "background.paper",
              borderRadius: 2,
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
                sx={{ bgcolor: "background.paper" }}
              >
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
      <Box sx={{ height: headerHeight }} />

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

      {courses && filteredCourses && filteredCourses.length > 0 && (
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

                return (
                  <Card
                    key={course.id}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2.5 }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                          <MenuBookRoundedIcon fontSize="small" />
                        </Avatar>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                          <Chip size="small" label={course.courseType} color="primary" variant="outlined" />
                          {course.level && (
                            <Chip
                              size="small"
                              label={t(`courseLevels.${course.level}`, course.level)}
                              color={LEVEL_COLOR[course.level]}
                              variant="outlined"
                            />
                          )}
                          {course.price > 0 ? (
                            <Chip size="small" label={formatVnd(course.price)} color="secondary" variant="outlined" />
                          ) : (
                            <Chip size="small" label={t("publicCourses.free")} color="success" variant="outlined" />
                          )}
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        {t("publicCourses.wordsAndTeacher", {
                          count: course.totalWords,
                          teacher: course.teacherName,
                        })}
                      </Typography>

                      <Box sx={{ mt: "auto", pt: 2 }}>
                        {enrollment ? (
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<PlayArrowRoundedIcon />}
                            onClick={() => router.push(`/learn/${course.id}`)}
                          >
                            {t("publicCourses.startLearning")}
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled={isEnrolling}
                            onClick={() => handleEnroll(course)}
                          >
                            {isEnrolling
                              ? t("publicCourses.enrolling")
                              : course.price > 0
                                ? t("publicCourses.buyNow")
                                : t("publicCourses.enroll")}
                          </Button>
                        )}
                      </Box>
                    </CardContent>
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

      {courses && courses.length > 0 && filteredCourses?.length === 0 && (
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
