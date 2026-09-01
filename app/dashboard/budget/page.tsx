"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import CoursePricesTab from "./components/CoursePricesTab";
import OverviewTab from "./components/OverviewTab";
import TransactionsTab from "./components/TransactionsTab";
import WithdrawalsTab from "./components/WithdrawalsTab";
import { getAuth } from "@/app/utils/auth-storage";

export default function BudgetPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!getAuth()?.roles?.includes("ROLE_ADMIN")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("budgetAdmin.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("budgetAdmin.subtitle")}
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_e, value) => setTab(value)} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tab label={t("budgetAdmin.tabOverview")} />
        <Tab label={t("budgetAdmin.tabTransactions")} />
        <Tab label={t("budgetAdmin.tabWithdrawals")} />
        <Tab label={t("budgetAdmin.tabCoursePrices")} />
      </Tabs>

      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && <OverviewTab />}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && <TransactionsTab />}
      </Box>
      <Box role="tabpanel" hidden={tab !== 2}>
        {tab === 2 && <WithdrawalsTab />}
      </Box>
      <Box role="tabpanel" hidden={tab !== 3}>
        {tab === 3 && <CoursePricesTab />}
      </Box>
    </Stack>
  );
}
