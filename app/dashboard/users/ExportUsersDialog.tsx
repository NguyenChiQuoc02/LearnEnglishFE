"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { exportUsers } from "@/app/services/export.service";
import { USER_ROLES } from "@/app/constants/user.constants";
import type { ExportFormat } from "@/app/types";

export default function ExportUsersDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ExportFormat>("EXCEL");
  const [role, setRole] = useState("");
  const [keyword, setKeyword] = useState("");
  const [exporting, setExporting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ticks once a second while the request is in flight, so the admin can see how
  // long a large export is taking instead of staring at a spinner with no signal.
  useEffect(() => {
    if (!exporting) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [exporting]);

  async function handleExport() {
    setError(null);
    setElapsedSeconds(0);
    setExporting(true);
    try {
      await exportUsers({ format, role: role || undefined, keyword: keyword.trim() || undefined });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("usersExport.errorCreateFailed"));
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 0 } } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontWeight: 700,
        }}
      >
        {t("usersExport.title")}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {exporting && (
            <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center", py: 2 }}>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary">
                {t("usersExport.exporting", { seconds: elapsedSeconds })}
              </Typography>
            </Stack>
          )}

          {!exporting && done && (
            <Alert severity="success">{t("usersExport.success")}</Alert>
          )}

          {!exporting && !done && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t("usersExport.instructions")}
              </Typography>

              <FormControl fullWidth>
                <InputLabel>{t("usersExport.fieldFormat")}</InputLabel>
                <Select
                  label={t("usersExport.fieldFormat")}
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                >
                  <MenuItem value="EXCEL">{t("usersExport.formatExcel")}</MenuItem>
                  <MenuItem value="WORD">{t("usersExport.formatWord")}</MenuItem>
                  <MenuItem value="PDF">{t("usersExport.formatPdf")}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t("usersExport.fieldRole")}</InputLabel>
                <Select
                  label={t("usersExport.fieldRole")}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="">{t("usersExport.allRoles")}</MenuItem>
                  {USER_ROLES.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label={t("usersExport.fieldKeyword")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                fullWidth
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={exporting}>
          {t("usersImport.close")}
        </Button>
        {!done && (
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={exporting}
            startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {exporting ? t("usersExport.starting") : t("usersExport.startButton")}
          </Button>
        )}
        {done && (
          <Button variant="contained" onClick={() => setDone(false)}>
            {t("usersExport.exportAgain")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
