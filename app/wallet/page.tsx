"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import DataTable, { type DataTableColumn } from "@/app/components/shared/DataTable";
import MomoQrDialog from "@/app/components/shared/MomoQrDialog";
import { useToast } from "@/app/components/shared/ToastContext";
import { getMomoStatus } from "@/app/services/payment.service";
import { createTopup, createWithdrawal, getMyWallet, listMyTransactions } from "@/app/services/wallet.service";
import { getAuth } from "@/app/utils/auth-storage";
import type {
  WalletResponse,
  WalletTransactionResponse,
  WalletTransactionStatus,
} from "@/app/types";

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

const STATUS_COLOR: Record<WalletTransactionStatus, "success" | "warning" | "error" | "default"> = {
  PENDING: "warning",
  SUCCESS: "success",
  FAILED: "error",
  CANCELLED: "default",
};

export default function WalletPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topupOpen, setTopupOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const [transactions, setTransactions] = useState<WalletTransactionResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  function loadWallet() {
    return getMyWallet()
      .then(setWallet)
      .catch((err) => setError(err instanceof Error ? err.message : t("wallet.errorLoadWallet")));
  }

  function loadTransactions() {
    setLoadingTransactions(true);
    return listMyTransactions(page, rowsPerPage)
      .then((result) => {
        setTransactions(result.content);
        setTotalCount(result.totalElements);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("wallet.errorLoadTransactions")))
      .finally(() => setLoadingTransactions(false));
  }

  useEffect(() => {
    // The layout's auth check alone doesn't stop this page from mounting and fetching data
    // (layouts don't gate route rendering here), so guard the fetches themselves too.
    if (!getAuth()) {
      router.replace("/login");
      return;
    }
    loadWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!getAuth()) return;
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const columns: DataTableColumn<WalletTransactionResponse>[] = [
    {
      key: "createdAt",
      header: t("wallet.columnDate"),
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "type",
      header: t("wallet.columnType"),
      render: (row) => t(`wallet.transactionTypes.${row.type}`),
    },
    {
      key: "status",
      header: t("wallet.columnStatus"),
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
      header: t("wallet.columnAmount"),
      align: "right",
      render: (row) => formatVnd(row.amount),
    },
    {
      key: "course",
      header: t("wallet.columnCourse"),
      render: (row) => row.courseTitle ?? "—",
    },
  ];

  return (
    <Stack spacing={3} sx={{ maxWidth: 960, mx: "auto" }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("wallet.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("wallet.subtitle")}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: { sm: "center" } }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexGrow: 1 }}>
              <AccountBalanceWalletRoundedIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("wallet.balanceLabel")}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {wallet ? formatVnd(wallet.balance) : "—"}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<ArrowDownwardRoundedIcon />}
                onClick={() => setTopupOpen(true)}
              >
                {t("wallet.topupButton")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowUpwardRoundedIcon />}
                onClick={() => setWithdrawOpen(true)}
              >
                {t("wallet.withdrawButton")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("wallet.transactionsTitle")}
        </Typography>
        <DataTable
          columns={columns}
          rows={transactions}
          getRowId={(row) => row.id}
          emptyMessage={t("wallet.emptyNoTransactions")}
          loading={loadingTransactions}
          serverSide
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setPage(0);
          }}
        />
      </Stack>

      {topupOpen && (
        <TopupDialog
          onClose={() => setTopupOpen(false)}
          onDone={() => {
            setTopupOpen(false);
            showToast(t("wallet.topupSuccess"));
            loadWallet();
            loadTransactions();
          }}
        />
      )}

      {withdrawOpen && (
        <WithdrawDialog
          onClose={() => setWithdrawOpen(false)}
          onDone={() => {
            setWithdrawOpen(false);
            showToast(t("wallet.withdrawPendingNotice"));
            loadWallet();
            loadTransactions();
          }}
        />
      )}
    </Stack>
  );
}

function TopupDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(100000);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [momoPayment, setMomoPayment] = useState<{ orderId: string; payUrl: string; amount: number } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (amount <= 0) {
      setError(t("wallet.errorAmountRequired"));
      return;
    }
    setSubmitting(true);
    try {
      const result = await createTopup(amount);
      setMomoPayment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("wallet.errorTopup"));
    } finally {
      setSubmitting(false);
    }
  }

  if (momoPayment) {
    return (
      <MomoQrDialog
        open
        payUrl={momoPayment.payUrl}
        orderId={momoPayment.orderId}
        amount={momoPayment.amount}
        onClose={onClose}
        onSuccess={onDone}
        checkStatus={getMomoStatus}
      />
    );
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("wallet.topupDialogTitle")}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label={t("wallet.fieldAmount")}
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
              autoFocus
              slotProps={{ htmlInput: { min: 1000, step: 1000 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? t("common.saving") : t("wallet.topupSubmit")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function WithdrawDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(100000);
  const [momoPhoneNumber, setMomoPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (amount <= 0) {
      setError(t("wallet.errorAmountRequired"));
      return;
    }
    if (!momoPhoneNumber.trim()) {
      setError(t("wallet.errorPhoneRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await createWithdrawal({ amount, momoPhoneNumber });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("wallet.errorWithdraw"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("wallet.withdrawDialogTitle")}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label={t("wallet.fieldAmount")}
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
              autoFocus
              slotProps={{ htmlInput: { min: 1000, step: 1000 } }}
            />
            <TextField
              label={t("wallet.fieldMomoPhone")}
              value={momoPhoneNumber}
              onChange={(e) => setMomoPhoneNumber(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? t("common.saving") : t("wallet.withdrawSubmit")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
