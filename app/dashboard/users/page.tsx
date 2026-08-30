"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DataTable from "@/app/components/shared/DataTable";
import type { DataTableColumn } from "@/app/components/shared/DataTable";
import { deleteUser, listUsers, updateUser } from "@/app/services/user.service";
import type { UserRequest, UserResponse } from "@/app/types";
import { USER_ROLES } from "@/app/constants/user.constants";

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);

  function reload() {
    listUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : t("usersAdmin.errorLoadUsers")));
  }

  useEffect(reload, []);

  const columns: DataTableColumn<UserResponse>[] = [
    {
      key: "user",
      header: t("usersAdmin.columnUsername"),
      render: (user) => (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            {user.username[0]?.toUpperCase()}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{user.username}</Typography>
        </Stack>
      ),
    },
    { key: "email", header: t("usersAdmin.columnEmail"), render: (user) => user.email },
    { key: "phone", header: t("usersAdmin.columnPhone"), render: (user) => user.phoneNumber ?? "—" },
    {
      key: "roles",
      header: t("usersAdmin.columnRoles"),
      render: (user) => (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {user.roles.map((role) => (
            <Chip key={role} size="small" label={role} variant="outlined" />
          ))}
        </Stack>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (user) => (
        <>
          <Tooltip title={t("common.edit")}>
            <IconButton size="small" onClick={() => setEditingUser(user)}>
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("common.delete")}>
            <IconButton size="small" onClick={() => setDeletingUser(user)}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("usersAdmin.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("usersAdmin.subtitle")}
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/dashboard/users/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          {t("usersAdmin.newUser")}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <DataTable
        columns={columns}
        rows={users ?? []}
        getRowId={(user) => user.id}
        emptyMessage={t("usersAdmin.emptyNoUsers")}
        noMatchMessage={t("usersAdmin.emptyNoMatch")}
        searchPlaceholder={t("usersAdmin.searchPlaceholder")}
        searchPredicate={(user, term) =>
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.phoneNumber ?? "").toLowerCase().includes(term)
        }
      />

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => {
            setUsers((prev) => prev?.map((u) => (u.id === updated.id ? updated : u)) ?? prev);
            setEditingUser(null);
          }}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDeleted={() => {
            setUsers((prev) => prev?.filter((u) => u.id !== deletingUser.id) ?? prev);
            setDeletingUser(null);
          }}
        />
      )}
    </Stack>
  );
}

function EditUserDialog({
  user,
  onClose,
  onSaved,
}: {
  user: UserResponse;
  onClose: () => void;
  onSaved: (user: UserResponse) => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<UserRequest>({
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    dateOfBirth: user.dateOfBirth ?? "",
    address: user.address ?? "",
    avatarUrl: user.avatarUrl ?? "",
    roles: user.roles,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleRolesChange(e: SelectChangeEvent<string[]>) {
    const value = e.target.value;
    setForm({ ...form, roles: typeof value === "string" ? value.split(",") : value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.roles.length === 0) {
      setError(t("usersAdmin.errorRolesRequired"));
      return;
    }
    setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        ...form,
        phoneNumber: form.phoneNumber || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address || undefined,
        avatarUrl: form.avatarUrl || undefined,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("usersAdmin.errorSaveUser"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("usersAdmin.editTitle")}</DialogTitle>
      <Box component="form" onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar src={form.avatarUrl || undefined} sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                {form.username[0]?.toUpperCase()}
              </Avatar>
              <TextField
                label={t("usersAdmin.fieldAvatarUrl")}
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                fullWidth
              />
            </Stack>
            <TextField
              label={t("usersAdmin.fieldUsername")}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label={t("usersAdmin.fieldEmail")}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label={t("usersAdmin.fieldPhone")}
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label={t("usersAdmin.fieldDateOfBirth")}
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label={t("usersAdmin.fieldAddress")}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              fullWidth
            />
            <Select
              multiple
              value={form.roles}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function DeleteUserDialog({
  user,
  onClose,
  onDeleted,
}: {
  user: UserResponse;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteUser(user.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("usersAdmin.errorDeleteUser"));
      setDeleting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("usersAdmin.deleteTitle")}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <DialogContentText>
          {t("usersAdmin.deleteConfirm", { username: user.username })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? t("common.deleting") : t("common.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
