"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DataTable from "@/app/components/shared/DataTable";
import type { DataTableColumn } from "@/app/components/shared/DataTable";
import ProvinceWardSelect from "@/app/components/shared/ProvinceWardSelect";
import { useToast } from "@/app/components/shared/ToastContext";
import { bulkDeleteUsers, deleteUser, listUsers, updateUser } from "@/app/services/user.service";
import type { UserRequest, UserResponse } from "@/app/types";
import { USER_ROLES } from "@/app/constants/user.constants";
import ExportUsersDialog from "./ExportUsersDialog";
import ImportUsersDialog from "./ImportUsersDialog";

const DEFAULT_PAGE_SIZE = 20;

export default function UsersPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  function fetchUsers(targetPage: number, targetSize: number, keyword: string) {
    setLoading(true);
    setError(null);
    listUsers({ page: targetPage, size: targetSize, keyword: keyword || undefined })
      .then((res) => {
        setUsers(res.content);
        setTotalElements(res.totalElements);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("usersAdmin.errorLoadUsers")))
      .finally(() => setLoading(false));
  }

  // Runs on mount (loads page 1 immediately) and whenever page/rowsPerPage/the
  // applied search term change. Typing alone doesn't refetch — only submitting
  // the search (Enter / search icon) updates appliedKeyword.
  useEffect(() => {
    fetchUsers(page, rowsPerPage, appliedKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, appliedKeyword]);

  function reload() {
    fetchUsers(page, rowsPerPage, appliedKeyword);
  }

  function handleSearchSubmit() {
    setPage(0);
    setAppliedKeyword(searchInput);
  }

  const columns: DataTableColumn<UserResponse>[] = [
    {
      key: "stt",
      header: t("common.stt"),
      align: "center",
      render: (_user, rowIndex) => rowIndex + 1,
    },
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
          <Tooltip title={t("common.viewDetail")}>
            <IconButton size="small" onClick={() => router.push(`/dashboard/users/${user.id}`)}>
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            onClick={() => setExportOpen(true)}
          >
            {t("usersAdmin.exportUsers")}
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFileRoundedIcon />}
            onClick={() => setImportOpen(true)}
          >
            {t("usersAdmin.importUsers")}
          </Button>
          <Button
            component={Link}
            href="/dashboard/users/new"
            variant="contained"
            startIcon={<AddRoundedIcon />}
          >
            {t("usersAdmin.newUser")}
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {selectedIds.size > 0 && (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Typography variant="body2">
            {t("usersAdmin.selectedCount", { count: selectedIds.size })}
          </Typography>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteRoundedIcon />}
            onClick={() => setBulkDeleteOpen(true)}
          >
            {t("usersAdmin.deleteSelected")}
          </Button>
          <Button size="small" onClick={() => setSelectedIds(new Set())}>
            {t("common.cancel")}
          </Button>
        </Stack>
      )}

      <DataTable
        columns={columns}
        rows={users}
        getRowId={(user) => user.id}
        emptyMessage={t("usersAdmin.emptyNoUsers")}
        noMatchMessage={t("usersAdmin.emptyNoMatch")}
        searchPlaceholder={t("usersAdmin.searchPlaceholder")}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        loading={loading}
        serverSide
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(0);
        }}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onRefresh={reload}
      />

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => {
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setEditingUser(null);
          }}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDeleted={() => {
            setDeletingUser(null);
            reload();
          }}
        />
      )}

      {importOpen && (
        <ImportUsersDialog onClose={() => setImportOpen(false)} onImported={reload} />
      )}

      {exportOpen && <ExportUsersDialog onClose={() => setExportOpen(false)} />}

      {bulkDeleteOpen && (
        <BulkDeleteUsersDialog
          ids={Array.from(selectedIds, (id) => Number(id))}
          onClose={() => setBulkDeleteOpen(false)}
          onDone={() => {
            setSelectedIds(new Set());
            reload();
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
  const { showToast } = useToast();
  const [form, setForm] = useState<UserRequest>({
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    dateOfBirth: user.dateOfBirth ?? "",
    address: user.address ?? "",
    avatarUrl: user.avatarUrl ?? "",
    provinceCode: user.provinceCode ?? "",
    wardCode: user.wardCode ?? "",
    roles: user.roles,
  });
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string }>({});

  function handleRolesChange(e: SelectChangeEvent<string[]>) {
    const value = e.target.value;
    setForm({ ...form, roles: typeof value === "string" ? value.split(",") : value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const nextFieldErrors: typeof fieldErrors = {};
    if (!form.username.trim()) nextFieldErrors.username = t("usersAdminNew.errorUsernameRequired");
    if (!form.email.trim()) nextFieldErrors.email = t("usersAdminNew.errorEmailRequired");
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    if (form.roles.length === 0) {
      showToast(t("usersAdmin.errorRolesRequired"), "error");
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
        provinceCode: form.provinceCode || undefined,
        wardCode: form.wardCode || undefined,
      });
      showToast(t("usersAdmin.saveSuccess"));
      onSaved(updated);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("usersAdmin.errorSaveUser"), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("usersAdmin.editTitle")}</DialogTitle>
      <Box component="form" onSubmit={handleSave} noValidate>
        <DialogContent>
          <Stack spacing={2}>
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
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
            />
            <TextField
              label={t("usersAdmin.fieldEmail")}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              fullWidth
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
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
            <ProvinceWardSelect
              value={{ provinceCode: form.provinceCode ?? "", wardCode: form.wardCode ?? "" }}
              onChange={(v) => setForm({ ...form, provinceCode: v.provinceCode, wardCode: v.wardCode })}
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
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteUser(user.id);
      showToast(t("usersAdmin.deleteSuccess"));
      onDeleted();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("usersAdmin.errorDeleteUser"), "error");
      setDeleting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("usersAdmin.deleteTitle")}</DialogTitle>
      <DialogContent>
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

function BulkDeleteUsersDialog({
  ids,
  onClose,
  onDone,
}: {
  ids: number[];
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const response = await bulkDeleteUsers(ids);
      onClose();
      if (response.successCount > 0) {
        showToast(
          t("usersAdmin.bulkDeleteResultSummary", {
            success: response.successCount,
            failure: response.failureCount,
          })
        );
        onDone();
      }
      response.results
        .filter((r) => !r.success)
        .forEach((r) => showToast(`${r.username ?? `#${r.id}`}: ${r.error}`, "error"));
    } catch (err) {
      onClose();
      showToast(err instanceof Error ? err.message : t("usersAdmin.errorBulkDelete"), "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("usersAdmin.bulkDeleteTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("usersAdmin.bulkDeleteConfirm", { count: ids.length })}
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
