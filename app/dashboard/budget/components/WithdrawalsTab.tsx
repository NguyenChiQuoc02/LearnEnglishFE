"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DataTable, { type DataTableColumn } from "@/app/components/shared/DataTable";
import { useToast } from "@/app/components/shared/ToastContext";
import { approveWithdrawal, listWithdrawals, rejectWithdrawal } from "@/app/services/budget.service";
import type { WithdrawalResponse, WithdrawalStatus } from "@/app/types";

const STATUSES: WithdrawalStatus[] = ["PENDING", "APPROVED", "REJECTED"];

const STATUS_COLOR: Record<WithdrawalStatus, "success" | "warning" | "error"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const DEFAULT_PAGE_SIZE = 10;

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function WithdrawalsTab() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [rows, setRows] = useState<WithdrawalResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectingRow, setRejectingRow] = useState<WithdrawalResponse | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    listWithdrawals({
      status: (statusFilter || undefined) as WithdrawalStatus | undefined,
      page,
      size: rowsPerPage,
    })
      .then((res) => {
        setRows(res.content);
        setTotalCount(res.totalElements);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("budgetAdmin.errorLoadWithdrawals")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, statusFilter]);

  async function handleApprove(row: WithdrawalResponse) {
    setProcessingId(row.id);
    try {
      await approveWithdrawal(row.id);
      showToast(t("budgetAdmin.approveSuccess"));
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("budgetAdmin.errorApprove"), "error");
    } finally {
      setProcessingId(null);
    }
  }

  const columns: DataTableColumn<WithdrawalResponse>[] = [
    { key: "user", header: t("budgetAdmin.columnUser"), render: (row) => row.username },
    { key: "phone", header: t("budgetAdmin.columnPhone"), render: (row) => row.momoPhoneNumber },
    { key: "amount", header: t("budgetAdmin.columnAmount"), align: "right", render: (row) => formatVnd(row.amount) },
    {
      key: "status",
      header: t("budgetAdmin.columnStatus"),
      render: (row) => (
        <Chip
          size="small"
          label={t(`budgetAdmin.withdrawalStatuses.${row.status}`)}
          color={STATUS_COLOR[row.status]}
          variant="outlined"
        />
      ),
    },
    {
      key: "requestedAt",
      header: t("budgetAdmin.columnRequestedAt"),
      render: (row) => new Date(row.requestedAt).toLocaleString(),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (row) =>
        row.status === "PENDING" ? (
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
            <Button
              size="small"
              variant="contained"
              disabled={processingId === row.id}
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row);
              }}
            >
              {t("budgetAdmin.approveButton")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={processingId === row.id}
              onClick={(e) => {
                e.stopPropagation();
                setRejectingRow(row);
              }}
            >
              {t("budgetAdmin.rejectButton")}
            </Button>
          </Stack>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" spacing={2}>
        <TextField
          select
          size="small"
          label={t("budgetAdmin.filterStatus")}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{t("budgetAdmin.filterAll")}</MenuItem>
          {STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {t(`budgetAdmin.withdrawalStatuses.${status}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        emptyMessage={t("budgetAdmin.emptyNoWithdrawals")}
        loading={loading}
        serverSide
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={setPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setPage(0);
        }}
        onRefresh={load}
      />

      {rejectingRow && (
        <RejectDialog
          row={rejectingRow}
          onClose={() => setRejectingRow(null)}
          onRejected={() => {
            setRejectingRow(null);
            load();
          }}
        />
      )}
    </Stack>
  );
}

function RejectDialog({
  row,
  onClose,
  onRejected,
}: {
  row: WithdrawalResponse;
  onClose: () => void;
  onRejected: () => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReject() {
    setSubmitting(true);
    try {
      await rejectWithdrawal(row.id, note || undefined);
      showToast(t("budgetAdmin.rejectSuccess"));
      onRejected();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("budgetAdmin.errorReject"), "error");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("budgetAdmin.rejectDialogTitle")}</DialogTitle>
      <DialogContent>
        <TextField
          label={t("budgetAdmin.fieldAdminNote")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleReject} color="error" variant="contained" disabled={submitting}>
          {submitting ? t("common.saving") : t("budgetAdmin.rejectButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
