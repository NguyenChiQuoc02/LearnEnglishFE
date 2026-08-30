"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trans, useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createUser } from "@/app/services/user.service";
import { DEFAULT_USER_PASSWORD, USER_ROLES } from "@/app/constants/user.constants";

export default function NewUserPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [roles, setRoles] = useState<string[]>(["ROLE_USER"]);

  function handleRolesChange(e: SelectChangeEvent<string[]>) {
    const value = e.target.value;
    setRoles(typeof value === "string" ? value.split(",") : value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (roles.length === 0) {
      setError(t("usersAdmin.errorRolesRequired"));
      return;
    }
    setLoading(true);
    try {
      await createUser({
        username,
        email,
        phoneNumber: phoneNumber || undefined,
        dateOfBirth: dateOfBirth || undefined,
        address: address || undefined,
        avatarUrl: avatarUrl || undefined,
        roles,
      });
      router.push("/dashboard/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("usersAdminNew.errorCreateUser"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 640 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {t("usersAdminNew.title")}
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <Alert severity="info">
                <Trans
                  i18nKey="usersAdminNew.defaultPasswordNotice"
                  values={{ password: DEFAULT_USER_PASSWORD }}
                  components={{ strong: <strong /> }}
                />
              </Alert>

              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar src={avatarUrl || undefined} sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                  {username[0]?.toUpperCase()}
                </Avatar>
                <TextField
                  label={t("usersAdmin.fieldAvatarUrl")}
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  fullWidth
                />
              </Stack>

              <TextField
                label={t("usersAdmin.fieldUsername")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label={t("usersAdmin.fieldEmail")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label={t("usersAdmin.fieldPhone")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
              />
              <TextField
                label={t("usersAdmin.fieldDateOfBirth")}
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <TextField
                label={t("usersAdmin.fieldAddress")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
              <Select
                multiple
                value={roles}
                onChange={handleRolesChange}
                renderValue={(selected) => (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {selected.map((role) => (
                      <Chip key={role} size="small" label={role} />
                    ))}
                  </Stack>
                )}
                fullWidth
              >
                {USER_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? t("usersAdminNew.creating") : t("usersAdminNew.createButton")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
