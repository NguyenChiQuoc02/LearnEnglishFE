"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await login(username, password);
      saveAuth(auth);
      router.push(isAdmin(auth) ? "/dashboard" : "/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
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
            Đăng nhập
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tiếp tục hành trình học từ vựng của bạn.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Chưa có tài khoản?{" "}
            <Link href="/register" style={{ fontWeight: 600 }}>
              Đăng ký ngay
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
