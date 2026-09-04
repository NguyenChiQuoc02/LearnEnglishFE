"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useToast } from "@/app/components/shared/ToastContext";
import { invalidateUploadMethodCache } from "@/app/services/fileUpload.service";
import { getUploadMethod, updateUploadMethod } from "@/app/services/systemConfig.service";
import { getAuth } from "@/app/utils/auth-storage";
import type { UploadMethod } from "@/app/types";

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("MINIO");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getAuth()?.roles?.includes("ROLE_ADMIN")) {
      router.replace("/dashboard");
    }
  }, [router]);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const method = await getUploadMethod();
      setUploadMethod(method);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("settingsPage.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  async function handleSave() {
    setSaving(true);
    try {
      const method = await updateUploadMethod(uploadMethod);
      setUploadMethod(method);
      invalidateUploadMethodCache();
      showToast(t("settingsPage.saveSuccess"), "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("settingsPage.saveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("settingsPage.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("settingsPage.subtitle")}
        </Typography>
      </Box>

      {loadError && <Alert severity="error">{loadError}</Alert>}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t("settingsPage.uploadMethodLabel")}
            </Typography>

            <RadioGroup
              value={uploadMethod}
              onChange={(e) => setUploadMethod(e.target.value as UploadMethod)}
            >
              <FormControlLabel
                value="MINIO"
                control={<Radio />}
                label={
                  <Stack>
                    <Typography variant="body1">{t("settingsPage.uploadMethodMinio")}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("settingsPage.uploadMethodMinioDesc")}
                    </Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="CLOUDINARY"
                control={<Radio />}
                label={
                  <Stack>
                    <Typography variant="body1">{t("settingsPage.uploadMethodCloudinary")}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("settingsPage.uploadMethodCloudinaryDesc")}
                    </Typography>
                  </Stack>
                }
              />
            </RadioGroup>

            <Box>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
              >
                {saving ? t("common.saving") : t("common.save")}
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
