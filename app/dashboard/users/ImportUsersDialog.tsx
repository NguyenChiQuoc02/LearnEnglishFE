"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DataTable from "@/app/components/shared/DataTable";
import ProcessStepper from "@/app/components/shared/ProcessStepper";
import type { DataTableColumn } from "@/app/components/shared/DataTable";
import { useToast } from "@/app/components/shared/ToastContext";
import {
  downloadImportTemplate,
  importUsers,
  previewImportUsers,
} from "@/app/services/user.service";
import type { UserImportResponse, UserImportRowResult } from "@/app/types";

export default function ImportUsersDialog({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: () => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<UserImportResponse | null>(null);
  const [result, setResult] = useState<UserImportResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [importing, setImporting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setPreview(null);
    setResult(null);
  }

  async function handlePreview() {
    if (!file) {
      showToast(t("usersImport.errorNoFile"), "error");
      return;
    }
    setChecking(true);
    try {
      const response = await previewImportUsers(file);
      setPreview(response);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("usersImport.errorPreviewFailed"), "error");
    } finally {
      setChecking(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    try {
      const response = await importUsers(file);
      setResult(response);
      if (response.successCount > 0) {
        showToast(
          t("usersImport.resultSummary", {
            success: response.successCount,
            failure: response.failureCount,
          })
        );
        onImported();
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("usersImport.errorImportFailed"), "error");
    } finally {
      setImporting(false);
    }
  }

  const columns: DataTableColumn<UserImportRowResult>[] = [
    { key: "row", header: t("usersImport.columnRow"), render: (r) => r.rowNumber },
    { key: "username", header: t("usersImport.columnUsername"), render: (r) => r.username ?? "—" },
    { key: "email", header: t("usersImport.columnEmail"), render: (r) => r.email ?? "—" },
    { key: "phone", header: t("usersImport.columnPhone"), render: (r) => r.phoneNumber ?? "—" },
    { key: "dob", header: t("usersImport.columnDateOfBirth"), render: (r) => r.dateOfBirth ?? "—" },
    { key: "role", header: t("usersImport.columnRole"), render: (r) => r.role ?? "—" },
    {
      key: "status",
      header: t("usersImport.columnStatus"),
      render: (r) => (
        <Stack spacing={0.5}>
          <Chip
            size="small"
            label={r.valid ? t("usersImport.statusValid") : t("usersImport.statusInvalid")}
            color={r.valid ? "success" : "error"}
            variant="outlined"
          />
          {!r.valid && r.error && (
            <Typography variant="caption" color="error">
              {r.error}
            </Typography>
          )}
        </Stack>
      ),
    },
  ];

  const activeData = result ?? preview;
  const hasErrorRows = !!preview && preview.failureCount > 0;

  const steps = [
    { key: "chooseFile", label: t("usersImport.stepChooseFile") },
    { key: "preview", label: t("usersImport.stepPreview") },
    { key: "confirm", label: t("usersImport.stepConfirm") },
    { key: "done", label: t("usersImport.stepDone") },
  ];
  const activeIndex = result ? 3 : preview ? 2 : file ? 1 : 0;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
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
        {t("usersImport.title")}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <ProcessStepper steps={steps} activeIndex={activeIndex} />

          <Typography variant="body2" color="text.secondary">
            {t("usersImport.instructions")}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={() =>
                downloadImportTemplate().catch((err) =>
                  showToast(err instanceof Error ? err.message : t("usersImport.errorPreviewFailed"), "error")
                )
              }
            >
              {t("usersImport.downloadTemplate")}
            </Button>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileRoundedIcon />}
            >
              {t("usersImport.chooseFile")}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Typography variant="body2" color="text.secondary">
              {file?.name ?? t("usersImport.noFileChosen")}
            </Typography>
          </Stack>

          {!result && (
            <Button
              variant="contained"
              onClick={handlePreview}
              disabled={!file || checking}
              startIcon={checking ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{ alignSelf: "flex-start" }}
            >
              {checking ? t("usersImport.previewing") : t("usersImport.preview")}
            </Button>
          )}

          {activeData && (
            <>
              <Typography variant="subtitle2">
                {result
                  ? t("usersImport.resultSummary", {
                      success: result.successCount,
                      failure: result.failureCount,
                    })
                  : t("usersImport.summary", {
                      success: preview!.successCount,
                      failure: preview!.failureCount,
                    })}
              </Typography>
              <DataTable
                columns={columns}
                rows={activeData.rows}
                getRowId={(r) => r.rowNumber}
                emptyMessage="—"
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={importing}>
          {result ? t("usersImport.close") : t("usersImport.cancel")}
        </Button>
        {!result && preview && (
          <Tooltip title={hasErrorRows ? t("usersImport.errorRowsBlockImport") : ""}>
            <span>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={importing || hasErrorRows || preview.successCount === 0}
                startIcon={importing ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {importing ? t("usersImport.importing") : t("usersImport.confirmImport")}
              </Button>
            </span>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
}
