import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type {
  BudgetOverviewResponse,
  PageResponse,
  WalletTransactionResponse,
  WalletTransactionStatus,
  WalletTransactionType,
  WithdrawalResponse,
  WithdrawalStatus,
} from "@/app/types";

export function getBudgetOverview() {
  return axiosClient
    .get<BudgetOverviewResponse>(API_ENDPOINTS.ADMIN_BUDGET.OVERVIEW)
    .then((res) => res.data);
}

export function listBudgetTransactions(params: {
  type?: WalletTransactionType;
  status?: WalletTransactionStatus;
  userId?: number;
  page: number;
  size: number;
}) {
  return axiosClient
    .get<PageResponse<WalletTransactionResponse>>(API_ENDPOINTS.ADMIN_BUDGET.TRANSACTIONS, {
      params,
    })
    .then((res) => res.data);
}

export function listWithdrawals(params: { status?: WithdrawalStatus; page: number; size: number }) {
  return axiosClient
    .get<PageResponse<WithdrawalResponse>>(API_ENDPOINTS.ADMIN_BUDGET.WITHDRAWALS, { params })
    .then((res) => res.data);
}

export function approveWithdrawal(id: number | string) {
  return axiosClient
    .post<WithdrawalResponse>(API_ENDPOINTS.ADMIN_BUDGET.WITHDRAWAL_APPROVE(id))
    .then((res) => res.data);
}

export function rejectWithdrawal(id: number | string, adminNote?: string) {
  return axiosClient
    .post<WithdrawalResponse>(API_ENDPOINTS.ADMIN_BUDGET.WITHDRAWAL_REJECT(id), { adminNote })
    .then((res) => res.data);
}
