"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { useImagePreview } from "@/app/components/shared/ImagePreviewContext";
import { useToast } from "@/app/components/shared/ToastContext";
import { deleteMinioFile, listMinioFiles, uploadFilesToMinio } from "@/app/services/minioUpload.service";
import { getAuth } from "@/app/utils/auth-storage";
import type { MinioFileResponse } from "@/app/types";

const ACCEPTED_INPUT = "image/*,video/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf";

type FileKind = "image" | "video" | "word" | "excel" | "pdf" | "other";

function getFileKind(filename: string): FileKind {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["xls", "xlsx"].includes(ext)) return "excel";
  if (ext === "pdf") return "pdf";
  return "other";
}

function FileKindIcon({ kind }: { kind: FileKind }) {
  switch (kind) {
    case "image":
      return <ImageRoundedIcon color="primary" />;
    case "video":
      return <MovieRoundedIcon color="secondary" />;
    case "word":
      return <DescriptionRoundedIcon sx={{ color: "#2b579a" }} />;
    case "excel":
      return <TableChartRoundedIcon sx={{ color: "#217346" }} />;
    case "pdf":
      return <PictureAsPdfRoundedIcon sx={{ color: "#d32f2f" }} />;
    default:
      return <InsertDriveFileRoundedIcon color="disabled" />;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MinioUploadPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { openImagePreview } = useImagePreview();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [files, setFiles] = useState<MinioFileResponse[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MinioFileResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!getAuth()?.roles?.includes("ROLE_ADMIN")) {
      router.replace("/dashboard");
    }
  }, [router]);

  const loadFiles = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await listMinioFiles();
      setFiles(data);
    } catch (err) {
      setListError(err instanceof Error ? err.message : t("minioUploadPage.fetchError"));
    } finally {
      setLoadingList(false);
    }
  }, [t]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (newFiles.length) setSelectedFiles((prev) => [...prev, ...newFiles]);
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (!selectedFiles.length) return;
    setUploading(true);
    setProgress(0);
    try {
      const results = await uploadFilesToMinio(selectedFiles, setProgress);
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (failureCount === 0) {
        showToast(t("minioUploadPage.uploadSuccessCount", { count: successCount }), "success");
      } else if (successCount === 0) {
        showToast(
          t("minioUploadPage.uploadAllFailed", { error: results[0]?.error ?? "" }),
          "error"
        );
      } else {
        showToast(
          t("minioUploadPage.uploadPartialSuccess", { success: successCount, failure: failureCount }),
          "warning"
        );
      }

      setSelectedFiles([]);
      loadFiles();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("minioUploadPage.uploadError"), "error");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMinioFile(deleteTarget.objectName);
      showToast(t("minioUploadPage.deleteSuccess"), "success");
      setDeleteTarget(null);
      loadFiles();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("minioUploadPage.deleteError"), "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("minioUploadPage.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("minioUploadPage.subtitle")}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadRoundedIcon />}
              disabled={uploading}
            >
              {t("minioUploadPage.chooseFile")}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_INPUT}
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFiles.length || uploading}
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadRoundedIcon />}
            >
              {uploading
                ? t("minioUploadPage.uploading")
                : selectedFiles.length > 1
                  ? t("minioUploadPage.uploadButtonCount", { count: selectedFiles.length })
                  : t("minioUploadPage.uploadButton")}
            </Button>
          </Stack>

          {selectedFiles.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {selectedFiles.map((file, index) => (
                <Chip
                  key={`${file.name}-${index}`}
                  icon={<FileKindIcon kind={getFileKind(file.name)} />}
                  label={`${file.name} (${formatBytes(file.size)})`}
                  onDelete={uploading ? undefined : () => removeSelectedFile(index)}
                  deleteIcon={<CloseRoundedIcon />}
                />
              ))}
            </Stack>
          )}

          {uploading && <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1 }} />}

          <Typography variant="caption" color="text.secondary">
            {t("minioUploadPage.acceptedTypes")}
          </Typography>
        </Stack>
      </Paper>

      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("minioUploadPage.listTitle")}
        </Typography>
        <Tooltip title={t("minioUploadPage.refresh")}>
          <span>
            <IconButton onClick={loadFiles} disabled={loadingList}>
              <RefreshRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {listError && <Alert severity="error">{listError}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("minioUploadPage.columnFile")}</TableCell>
              <TableCell align="right">{t("minioUploadPage.columnSize")}</TableCell>
              <TableCell>{t("minioUploadPage.columnUploadedAt")}</TableCell>
              <TableCell align="center">{t("minioUploadPage.columnActions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingList ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("minioUploadPage.empty")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => {
                const kind = getFileKind(file.originalFilename);
                return (
                  <TableRow key={file.objectName}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <FileKindIcon kind={kind} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            cursor: kind === "image" ? "zoom-in" : "default",
                          }}
                          onClick={() =>
                            kind === "image" ? openImagePreview(file.url, file.originalFilename) : undefined
                          }
                        >
                          {file.originalFilename}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{formatBytes(file.size)}</TableCell>
                    <TableCell>{new Date(file.uploadedAt).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={t("minioUploadPage.open")}>
                        <IconButton size="small" component="a" href={file.url} target="_blank" rel="noopener noreferrer">
                          <OpenInNewRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("minioUploadPage.delete")}>
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(file)}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("minioUploadPage.deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("minioUploadPage.deleteConfirmMessage", { name: deleteTarget?.originalFilename })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? t("common.deleting") : t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
