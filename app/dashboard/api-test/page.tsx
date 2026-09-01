"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import { listAllWards, listProvinces } from "@/app/services/address.service";
import { listAllUsers } from "@/app/services/user.service";
import { clearApiCache } from "@/app/services/cacheTest.service";
import { getAuth } from "@/app/utils/auth-storage";

type ApiKey = "provinces" | "wards" | "users";

type RunResult = {
  beforeMs: number;
  afterMs: number;
  recordCount: number;
};

const APIS: { key: ApiKey; labelKey: string; endpoint: string; call: () => Promise<unknown[]> }[] = [
  { key: "provinces", labelKey: "apiTestPage.apiProvinces", endpoint: API_ENDPOINTS.PROVINCES.BASE, call: listProvinces },
  { key: "wards", labelKey: "apiTestPage.apiWards", endpoint: API_ENDPOINTS.WARDS.BASE, call: listAllWards },
  { key: "users", labelKey: "apiTestPage.apiUsers", endpoint: API_ENDPOINTS.USERS.ALL, call: listAllUsers },
];

function formatMs(value: number) {
  return `${value.toFixed(1)} ms`;
}

export default function ApiTestPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [results, setResults] = useState<Partial<Record<ApiKey, RunResult>>>({});
  const [loading, setLoading] = useState<Partial<Record<ApiKey, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<ApiKey, string | null>>>({});
  const [runningAll, setRunningAll] = useState(false);

  useEffect(() => {
    if (!getAuth()?.roles?.includes("ROLE_ADMIN")) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function runTest(key: ApiKey) {
    const api = APIS.find((a) => a.key === key);
    if (!api) return;

    setLoading((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: null }));

    try {
      await clearApiCache();

      const t0 = performance.now();
      await api.call();
      const t1 = performance.now();
      const afterData = await api.call();
      const t2 = performance.now();

      setResults((prev) => ({
        ...prev,
        [key]: { beforeMs: t1 - t0, afterMs: t2 - t1, recordCount: afterData.length },
      }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err instanceof Error ? err.message : "Request failed" }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function runAll() {
    setRunningAll(true);
    for (const api of APIS) {
      await runTest(api.key);
    }
    setRunningAll(false);
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("apiTestPage.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("apiTestPage.subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlayArrowRoundedIcon />}
          onClick={runAll}
          disabled={runningAll}
        >
          {runningAll ? t("apiTestPage.running") : t("apiTestPage.runAll")}
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("apiTestPage.columnApi")}</TableCell>
              <TableCell>{t("apiTestPage.columnEndpoint")}</TableCell>
              <TableCell align="right">{t("apiTestPage.columnRecords")}</TableCell>
              <TableCell align="right">{t("apiTestPage.columnBefore")}</TableCell>
              <TableCell align="right">{t("apiTestPage.columnAfter")}</TableCell>
              <TableCell align="right">{t("apiTestPage.columnImprovement")}</TableCell>
              <TableCell align="center">{t("apiTestPage.run")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {APIS.map((api) => {
              const result = results[api.key];
              const isLoading = Boolean(loading[api.key]);
              const improvement =
                result && result.beforeMs > 0
                  ? ((result.beforeMs - result.afterMs) / result.beforeMs) * 100
                  : null;

              return (
                <TableRow key={api.key}>
                  <TableCell sx={{ fontWeight: 600 }}>{t(api.labelKey)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                      GET {api.endpoint}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{result ? result.recordCount : "—"}</TableCell>
                  <TableCell align="right">{result ? formatMs(result.beforeMs) : "—"}</TableCell>
                  <TableCell align="right">{result ? formatMs(result.afterMs) : "—"}</TableCell>
                  <TableCell align="right">
                    {improvement !== null ? (
                      <Chip
                        size="small"
                        color={improvement > 0 ? "success" : "default"}
                        label={
                          improvement > 0
                            ? t("apiTestPage.fasterBy", { percent: improvement.toFixed(0) })
                            : t("apiTestPage.slowerBy", { percent: Math.abs(improvement).toFixed(0) })
                        }
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => runTest(api.key)}
                      disabled={isLoading || runningAll}
                      startIcon={isLoading ? <CircularProgress size={14} /> : undefined}
                    >
                      {t("apiTestPage.run")}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {APIS.map((api) => {
        const error = errors[api.key];
        return error ? (
          <Alert key={api.key} severity="error">
            {t(api.labelKey)}: {t("apiTestPage.errorPrefix")} {error}
          </Alert>
        ) : null;
      })}
    </Stack>
  );
}
