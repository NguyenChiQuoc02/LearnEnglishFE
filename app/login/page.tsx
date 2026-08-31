"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { login } from "@/app/services/auth.service";
import { isAdmin, saveAuth } from "@/app/utils/auth-storage";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nextUsernameError = username.trim() ? null : t("login.errorUsernameRequired");
    const nextPasswordError = password ? null : t("login.errorPasswordRequired");
    setUsernameError(nextUsernameError);
    setPasswordError(nextPasswordError);
    if (nextUsernameError || nextPasswordError) return;

    setLoading(true);
    try {
      const auth = await login(username, password);
      saveAuth(auth);
      router.push(isAdmin(auth) ? "/dashboard" : "/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {t("login.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("login.subtitle")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label={t("login.fieldUsername")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
                error={!!usernameError}
                helperText={usernameError}
              />
              <TextField
                label={t("login.fieldPassword")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? t("login.submitting") : t("login.submit")}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            {t("login.noAccount")}{" "}
            <Link href="/register" style={{ fontWeight: 600 }}>
              {t("login.registerNow")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
