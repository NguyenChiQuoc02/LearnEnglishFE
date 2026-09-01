"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { getBudgetOverview } from "@/app/services/budget.service";
import type { BudgetOverviewResponse } from "@/app/types";

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function OverviewTab() {
  const { t } = useTranslation();
  const [overview, setOverview] = useState<BudgetOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBudgetOverview()
      .then(setOverview)
      .catch((err) => setError(err instanceof Error ? err.message : t("budgetAdmin.errorLoadOverview")));
  }, [t]);

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!overview) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats: { label: string; value: string }[] = [
    { label: t("budgetAdmin.statTotalRevenue"), value: formatVnd(overview.totalRevenue) },
    { label: t("budgetAdmin.statTotalWalletBalance"), value: formatVnd(overview.totalWalletBalance) },
    {
      label: t("budgetAdmin.statPendingWithdrawals"),
      value: t("budgetAdmin.statPendingWithdrawalsValue", {
        count: overview.pendingWithdrawalsCount,
        amount: formatVnd(overview.pendingWithdrawalsAmount),
      }),
    },
    { label: t("budgetAdmin.statTotalTopup"), value: formatVnd(overview.totalTopupAmount) },
    { label: t("budgetAdmin.statTotalWithdrawn"), value: formatVnd(overview.totalWithdrawnAmount) },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
      }}
    >
      {stats.map((stat) => (
        <Card key={stat.label} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
              {stat.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
