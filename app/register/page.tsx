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
import { register } from "@/app/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nextFieldErrors: typeof fieldErrors = {};
    if (!username.trim()) nextFieldErrors.username = t("register.errorUsernameRequired");
    if (!email.trim()) nextFieldErrors.email = t("register.errorEmailRequired");
    if (!password) nextFieldErrors.password = t("register.errorPasswordRequired");
    if (!confirmPassword) nextFieldErrors.confirmPassword = t("register.errorConfirmPasswordRequired");
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    if (password !== confirmPassword) {
      setError(t("register.errorMismatch"));
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.errorGeneric"));
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
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {t("register.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("register.subtitle")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label={t("register.fieldUsername")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
              />
              <TextField
                label={t("register.fieldEmail")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />
              <TextField
                label={t("register.fieldPassword")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
              />
              <TextField
                label={t("register.fieldConfirmPassword")}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? t("register.submitting") : t("register.submit")}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            {t("register.haveAccount")}{" "}
            <Link href="/login" style={{ fontWeight: 600 }}>
              {t("register.loginNow")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
