"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import MomoQrDialog from "./MomoQrDialog";
import { useToast } from "./ToastContext";
import { getMomoStatus, payCourseWithMomo, payCourseWithWallet } from "@/app/services/payment.service";
import type { EnrollmentResponse } from "@/app/types";

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export type PaymentMethodDialogProps = {
  open: boolean;
  course: { id: number; title: string; price: number };
  walletBalance: number;
  onClose: () => void;
  onPaid: (enrollment: EnrollmentResponse) => void;
};

export default function PaymentMethodDialog({
  open,
  course,
  walletBalance,
  onClose,
  onPaid,
}: PaymentMethodDialogProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [payingWithWallet, setPayingWithWallet] = useState(false);
  const [payingWithMomo, setPayingWithMomo] = useState(false);
  const [momoPayment, setMomoPayment] = useState<{ orderId: string; payUrl: string; amount: number } | null>(null);

  const insufficientBalance = walletBalance < course.price;

  async function handlePayWithWallet() {
    setError(null);
    setPayingWithWallet(true);
    try {
      const enrollment = await payCourseWithWallet(course.id);
      showToast(t("payment.successPayWallet"));
      onPaid(enrollment);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("payment.errorPayWallet"));
    } finally {
      setPayingWithWallet(false);
    }
  }

  async function handlePayWithMomo() {
    setError(null);
    setPayingWithMomo(true);
    try {
      const result = await payCourseWithMomo(course.id);
      setMomoPayment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("payment.errorPayMomo"));
    } finally {
      setPayingWithMomo(false);
    }
  }

  function handleMomoSuccess() {
    setMomoPayment(null);
    showToast(t("payment.successPayMomo"));
    onPaid({
      id: 0,
      courseId: course.id,
      courseTitle: course.title,
      status: "ACTIVE",
      totalScore: 0,
      wordsLearnedCount: 0,
      enrolledAt: new Date().toISOString(),
      lastStudiedAt: null,
    });
    onClose();
  }

  return (
    <>
      <Dialog open={open && !momoPayment} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>{t("payment.methodDialogTitle")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ py: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Typography variant="body2" color="text.secondary">
              {t("payment.coursePriceLabel", { title: course.title, price: formatVnd(course.price) })}
            </Typography>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                opacity: insufficientBalance || payingWithWallet ? 0.6 : 1,
              }}
            >
              <CardActionArea
                disabled={insufficientBalance || payingWithWallet}
                onClick={handlePayWithWallet}
                sx={{ p: 2 }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 0 }}>
                  <AccountBalanceWalletRoundedIcon color="primary" />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontWeight: 600 }}>{t("payment.payWithWallet")}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("payment.walletBalanceLabel", { balance: formatVnd(walletBalance) })}
                    </Typography>
                    {insufficientBalance && (
                      <Typography variant="caption" color="error" sx={{ display: "block" }}>
                        {t("payment.insufficientBalance")}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Box>

            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, opacity: payingWithMomo ? 0.6 : 1 }}>
              <CardActionArea disabled={payingWithMomo} onClick={handlePayWithMomo} sx={{ p: 2 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 0 }}>
                  <QrCode2RoundedIcon color="secondary" />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontWeight: 600 }}>{t("payment.payWithMomo")}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("payment.momoHint")}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
        </DialogActions>
      </Dialog>

      {momoPayment && (
        <MomoQrDialog
          open
          payUrl={momoPayment.payUrl}
          orderId={momoPayment.orderId}
          amount={momoPayment.amount}
          onClose={() => setMomoPayment(null)}
          onSuccess={handleMomoSuccess}
          checkStatus={getMomoStatus}
        />
      )}
    </>
  );
}
