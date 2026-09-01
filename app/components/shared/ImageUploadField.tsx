"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import ZoomableAvatar from "@/app/components/shared/ZoomableAvatar";
import { useToast } from "@/app/components/shared/ToastContext";
import { uploadImageToCloudinary } from "@/app/services/upload.service";

export default function ImageUploadField({
  label,
  value,
  onChange,
  shape = "rounded",
  size = 56,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  shape?: "rounded" | "circular" | "square";
  size?: number;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("imageUpload.errorUpload"), "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <ZoomableAvatar
          variant={shape === "circular" ? "circular" : "rounded"}
          src={value || undefined}
          sx={{ width: size, height: size, bgcolor: "primary.main" }}
        >
          <ImageRoundedIcon />
        </ZoomableAvatar>
        {uploading && (
          <CircularProgress
            size={size}
            thickness={2}
            sx={{ position: "absolute", top: 0, left: 0, color: "common.white" }}
          />
        )}
      </Box>

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button
            size="small"
            variant="outlined"
            component="label"
            startIcon={<CloudUploadRoundedIcon fontSize="small" />}
            disabled={uploading}
          >
            {uploading
              ? t("imageUpload.uploading")
              : value
                ? t("imageUpload.changeButton")
                : t("imageUpload.uploadButton")}
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
          {value && !uploading && (
            <IconButton size="small" onClick={() => onChange("")} aria-label={t("imageUpload.remove")}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
