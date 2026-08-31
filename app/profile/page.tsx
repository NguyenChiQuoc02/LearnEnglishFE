"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { changePassword } from "@/app/services/auth.service";
import { getMyProfile, updateMyProfile } from "@/app/services/user.service";
import { generateZaloLinkCode, getMyZaloStatus } from "@/app/services/zalo.service";
import { useAuth } from "@/app/utils/auth-storage";
import ProvinceWardSelect from "@/app/components/shared/ProvinceWardSelect";
import { useToast } from "@/app/components/shared/ToastContext";
import type { UserResponse, ZaloLinkCodeResponse } from "@/app/types";

export default function ProfilePage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const theme = useTheme();

  return (
    <Stack spacing={3} sx={{ maxWidth: 640, mx: "auto" }}>
      <Card
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          color: "#fff",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          boxShadow: `0 20px 40px -12px ${alpha(theme.palette.primary.main, 0.5)}`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor: alpha("#fff", 0.12),
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            bgcolor: alpha("#fff", 0.08),
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2.5}
          sx={{ alignItems: { xs: "flex-start", sm: "center" }, position: "relative" }}
        >
          <Avatar
            sx={{
              width: 88,
              height: 88,
              fontSize: 32,
              fontWeight: 800,
              bgcolor: alpha("#fff", 0.2),
              color: "#fff",
              border: "3px solid",
              borderColor: alpha("#fff", 0.6),
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            {auth?.username?.[0]?.toUpperCase() ?? "?"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {auth?.username ?? "—"}
              </Typography>
              <VerifiedRoundedIcon sx={{ fontSize: 20, opacity: 0.9 }} />
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, opacity: 0.92 }}>
              <EmailRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{auth?.email ?? "—"}</Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1.5, opacity: 0.8, fontWeight: 600, letterSpacing: 0.3 }}
            >
              {t("profile.roles")}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mt: 0.5 }}>
              {auth?.roles?.length ? (
                auth.roles.map((role) => (
                  <Chip
                    key={role}
                    label={t(`roles.${role}`, { defaultValue: role })}
                    size="small"
                    sx={{
                      color: "#fff",
                      bgcolor: alpha("#fff", 0.18),
                      border: "1px solid",
                      borderColor: alpha("#fff", 0.35),
                      fontWeight: 600,
                      backdropFilter: "blur(4px)",
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2">—</Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Card>

      <PersonalInfoCard />

      <ZaloLinkCard />

      <ChangePasswordCard />
    </Stack>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: `0 12px 28px -14px ${alpha(theme.palette.primary.main, 0.35)}`,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function PersonalInfoCard() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then((data) => {
      setProfile(data);
      setProvinceCode(data.provinceCode ?? "");
      setWardCode(data.wardCode ?? "");
    });
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await updateMyProfile({
        phoneNumber: profile.phoneNumber ?? undefined,
        dateOfBirth: profile.dateOfBirth ?? undefined,
        address: profile.address ?? undefined,
        avatarUrl: profile.avatarUrl ?? undefined,
        provinceCode: provinceCode || undefined,
        wardCode: wardCode || undefined,
      });
      setProfile(updated);
      showToast(t("address.saveSuccess"));
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("address.errorSave"), "error");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return null;

  return (
    <SectionCard icon={<PersonRoundedIcon />} title={t("profile.personalInfoTitle")}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label={t("usersAdmin.fieldPhone")}
            value={profile.phoneNumber ?? ""}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            fullWidth
          />
          <TextField
            label={t("usersAdmin.fieldDateOfBirth")}
            type="date"
            value={profile.dateOfBirth ?? ""}
            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
        <TextField
          label={t("usersAdmin.fieldAddress")}
          value={profile.address ?? ""}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          fullWidth
        />
        <ProvinceWardSelect
          value={{ provinceCode, wardCode }}
          onChange={(v) => {
            setProvinceCode(v.provinceCode);
            setWardCode(v.wardCode);
          }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ alignSelf: "flex-start", borderRadius: 2.5, px: 3, fontWeight: 700 }}
        >
          {saving ? t("common.saving") : t("common.save")}
        </Button>
      </Stack>
    </SectionCard>
  );
}

function ZaloLinkCard() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [linked, setLinked] = useState<boolean | null>(null);
  const [linkCode, setLinkCode] = useState<ZaloLinkCodeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  function refreshStatus() {
    getMyZaloStatus()
      .then((res) => setLinked(res.linked))
      .catch(() => setLinked(false));
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  async function handleGenerateCode() {
    setLoading(true);
    try {
      const res = await generateZaloLinkCode();
      setLinkCode(res);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("profile.zalo.errorGenerateCode"), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard icon={<ChatRoundedIcon />} title={t("profile.zalo.title")}>
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t("profile.zalo.description")}
        </Typography>

        {linked && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            {t("profile.zalo.linked")}
          </Alert>
        )}

        {linked === false && !linkCode && (
          <Button
            variant="outlined"
            onClick={handleGenerateCode}
            disabled={loading}
            sx={{ alignSelf: "flex-start", borderRadius: 2.5, px: 3, fontWeight: 700 }}
          >
            {loading ? t("profile.zalo.generating") : t("profile.zalo.getCodeButton")}
          </Button>
        )}

        {linkCode && (
          <Stack spacing={1.5}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {t("profile.zalo.instructions")}
            </Alert>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, letterSpacing: 4, textAlign: "center", py: 1 }}
            >
              {linkCode.code}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                href={linkCode.followUrl}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewRoundedIcon />}
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                {t("profile.zalo.openOaButton")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={refreshStatus}
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                {t("profile.zalo.checkStatusButton")}
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
}

function ChangePasswordCard() {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const nextFieldErrors: typeof fieldErrors = {};
    if (!oldPassword) nextFieldErrors.oldPassword = t("profile.errorOldPasswordRequired");
    if (!newPassword) nextFieldErrors.newPassword = t("profile.errorNewPasswordRequired");
    if (!confirmPassword) nextFieldErrors.confirmPassword = t("profile.errorConfirmPasswordRequired");
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

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

  function visibilityAdornment(shown: boolean, toggle: () => void) {
    return {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={toggle} edge="end" size="small" tabIndex={-1}>
            {shown ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
          </IconButton>
        </InputAdornment>
      ),
    };
  }

  return (
    <SectionCard icon={<LockRoundedIcon />} title={t("profile.changePasswordTitle")}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {t("profile.success")}
            </Alert>
          )}
          <TextField
            label={t("profile.fieldOldPassword")}
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.oldPassword}
            helperText={fieldErrors.oldPassword}
            slotProps={{ input: visibilityAdornment(showOld, () => setShowOld((s) => !s)) }}
          />
          <TextField
            label={t("profile.fieldNewPassword")}
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.newPassword}
            helperText={fieldErrors.newPassword}
            slotProps={{ input: visibilityAdornment(showNew, () => setShowNew((s) => !s)) }}
          />
          <TextField
            label={t("profile.fieldConfirmPassword")}
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
            slotProps={{ input: visibilityAdornment(showConfirm, () => setShowConfirm((s) => !s)) }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ alignSelf: "flex-start", borderRadius: 2.5, px: 3, fontWeight: 700 }}
          >
            {loading ? t("profile.submitting") : t("profile.submit")}
          </Button>
        </Stack>
      </Box>
    </SectionCard>
  );
}
