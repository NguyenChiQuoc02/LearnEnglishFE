"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getAuth } from "@/app/utils/auth-storage";

export default function ProfilePage() {
  const auth = getAuth();

  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Hồ sơ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Thông tin tài khoản của bạn.
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
                Tên đăng nhập
              </Typography>
              <Typography variant="body1">{auth?.username ?? "—"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{auth?.email ?? "—"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Vai trò
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
    </Stack>
  );
}
