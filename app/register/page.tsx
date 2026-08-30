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
import { register } from "@/app/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
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
            Tạo tài khoản
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bắt đầu học từ vựng tiếng Anh ngay hôm nay.
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
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Đã có tài khoản?{" "}
            <Link href="/login" style={{ fontWeight: 600 }}>
              Đăng nhập
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
