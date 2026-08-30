"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { changePassword } from "@/app/services/auth.service";
import { useAuth } from "@/app/utils/auth-storage";

export default function ProfilePage() {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("profile.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("profile.subtitle")}
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: 24 }}>
              {auth?.username?.[0]?.toUpperCase() ?? "?"}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {auth?.username ?? "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {auth?.email ?? "—"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t("profile.username")}
              </Typography>
              <Typography variant="body1">{auth?.username ?? "—"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t("profile.email")}
              </Typography>
              <Typography variant="body1">{auth?.email ?? "—"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t("profile.roles")}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {auth?.roles?.length ? (
                  auth.roles.map((role) => (
                    <Chip key={role} label={role} size="small" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body1">—</Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <ChangePasswordCard />
    </Stack>
  );
}

function ChangePasswordCard() {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError(t("profile.errorMismatch"));
      return;
    }
    if (newPassword.length < 6) {
      setError(t("profile.errorTooShort"));
      return;
    }

    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profile.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {t("profile.changePasswordTitle")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ maxWidth: 360 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{t("profile.success")}</Alert>}
            <TextField
              label={t("profile.fieldOldPassword")}
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t("profile.fieldNewPassword")}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label={t("profile.fieldConfirmPassword")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={loading} sx={{ alignSelf: "flex-start" }}>
              {loading ? t("profile.submitting") : t("profile.submit")}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
