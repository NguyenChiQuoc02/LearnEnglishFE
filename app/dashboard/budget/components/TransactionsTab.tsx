"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DataTable, { type DataTableColumn } from "@/app/components/shared/DataTable";
import { listBudgetTransactions } from "@/app/services/budget.service";
import type {
  WalletTransactionResponse,
  WalletTransactionStatus,
  WalletTransactionType,
} from "@/app/types";

const TYPES: WalletTransactionType[] = ["TOPUP", "WITHDRAW", "COURSE_PAYMENT", "REFUND"];
const STATUSES: WalletTransactionStatus[] = ["PENDING", "SUCCESS", "FAILED", "CANCELLED"];

const STATUS_COLOR: Record<WalletTransactionStatus, "success" | "warning" | "error" | "default"> = {
  PENDING: "warning",
  SUCCESS: "success",
  FAILED: "error",
  CANCELLED: "default",
};

const DEFAULT_PAGE_SIZE = 10;

export default function TransactionsTab() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<WalletTransactionResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    listBudgetTransactions({
      type: (typeFilter || undefined) as WalletTransactionType | undefined,
      status: (statusFilter || undefined) as WalletTransactionStatus | undefined,
      page,
      size: rowsPerPage,
    })
      .then((res) => {
        const sorted = [...res.content].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRows(sorted);
        setTotalCount(res.totalElements);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("budgetAdmin.errorLoadTransactions")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, typeFilter, statusFilter]);

  const columns: DataTableColumn<WalletTransactionResponse>[] = [
    { key: "id", header: "ID", render: (row) => row.id },
    {
      key: "createdAt",
      header: t("budgetAdmin.columnDate"),
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "type",
      header: t("budgetAdmin.columnType"),
      render: (row) => t(`wallet.transactionTypes.${row.type}`),
    },
    {
      key: "status",
      header: t("budgetAdmin.columnStatus"),
      render: (row) => (
        <Chip
          size="small"
          label={t(`wallet.transactionStatuses.${row.status}`)}
          color={STATUS_COLOR[row.status]}
          variant="outlined"
        />
      ),
    },
    {
      key: "amount",
      header: t("budgetAdmin.columnAmount"),
      align: "right",
      render: (row) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.amount),
    },
    { key: "course", header: t("budgetAdmin.columnCourse"), render: (row) => row.courseTitle ?? "—" },
    { key: "user", header: t("budgetAdmin.columnUser"), render: (row) => row.username },
  ];

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
        <TextField
          select
          size="small"
          label={t("budgetAdmin.filterType")}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{t("budgetAdmin.filterAll")}</MenuItem>
          {TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`wallet.transactionTypes.${type}`)}
            </MenuItem>
          ))}
        </TextField>
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
              {t(`wallet.transactionStatuses.${status}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        emptyMessage={t("budgetAdmin.emptyNoTransactions")}
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
    </Stack>
  );
}
