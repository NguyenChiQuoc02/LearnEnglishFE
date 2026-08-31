"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BackButton from "@/app/dashboard/components/BackButton";
import SectionLabel from "@/app/dashboard/components/SectionLabel";
import { getUser } from "@/app/services/user.service";
import type { UserResponse } from "@/app/types";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getUser(id)
      .then(setUser)
      .catch((err) => setLoadError(err instanceof Error ? err.message : t("usersAdminDetail.errorLoadUser")));
  }, [id, t]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: "auto" }}>
      <BackButton onClick={() => router.push("/dashboard/users")} />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("usersAdminDetail.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("usersAdminDetail.subtitle")}
        </Typography>
      </Box>

      {loadError && <Alert severity="error">{loadError}</Alert>}

      {!user && !loadError && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {user && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
                  {user.username[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {user.username}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                    {user.roles.map((role) => (
                      <Chip key={role} size="small" label={t(`roles.${role}`, role)} variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <SectionLabel>{t("usersAdminDetail.sectionContact")}</SectionLabel>

                <DetailRow label={t("usersAdmin.fieldEmail")} value={user.email} />
                <DetailRow label={t("usersAdmin.fieldPhone")} value={user.phoneNumber ?? "—"} />
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <SectionLabel>{t("usersAdminDetail.sectionPersonalInfo")}</SectionLabel>

                <DetailRow label={t("usersAdmin.fieldDateOfBirth")} value={user.dateOfBirth ?? "—"} />
                <DetailRow label={t("usersAdmin.fieldAddress")} value={user.address ?? "—"} />
                <DetailRow
                  label={t("address.province")}
                  value={user.provinceName ?? "—"}
                />
                <DetailRow label={t("address.ward")} value={user.wardName ?? "—"} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
