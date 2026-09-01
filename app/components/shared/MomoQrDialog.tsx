"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { QRCodeSVG } from "qrcode.react";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export type MomoQrDialogProps = {
  open: boolean;
  payUrl: string;
  orderId: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
  checkStatus: (orderId: string) => Promise<{ status: string }>;
};

export default function MomoQrDialog({
  open,
  payUrl,
  orderId,
  amount,
  onClose,
  onSuccess,
  checkStatus,
}: MomoQrDialogProps) {
  const { t } = useTranslation();
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkingRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const startedAt = Date.now();

    const interval = setInterval(async () => {
      if (checkingRef.current) return;
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        clearInterval(interval);
        setTimedOut(true);
        return;
      }
      checkingRef.current = true;
      try {
        const result = await checkStatus(orderId);
        if (result.status === "SUCCESS") {
          clearInterval(interval);
          onSuccess();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("payment.errorCheckStatus"));
      } finally {
        checkingRef.current = false;
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("payment.momoDialogTitle")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", py: 1 }}>
          {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {formatVnd(amount)}
          </Typography>

          <Box sx={{ p: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <QRCodeSVG value={payUrl} size={220} />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {t("payment.momoScanHint")}
          </Typography>

          <Button href={payUrl} target="_blank" rel="noopener noreferrer" variant="outlined" fullWidth>
            {t("payment.momoOpenApp")}
          </Button>

          {timedOut ? (
            <Alert severity="warning" sx={{ width: "100%" }}>
              {t("payment.momoTimeout")}
            </Alert>
          ) : (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                {t("payment.momoWaiting")}
              </Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}
