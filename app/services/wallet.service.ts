import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type {
  MomoPaymentResponse,
  PageResponse,
  WalletResponse,
  WalletTransactionResponse,
  WithdrawalRequestPayload,
  WithdrawalResponse,
} from "@/app/types";

export function getMyWallet() {
  return axiosClient.get<WalletResponse>(API_ENDPOINTS.WALLET.ME).then((res) => res.data);
}

export function listMyTransactions(page: number, size: number) {
  return axiosClient
    .get<PageResponse<WalletTransactionResponse>>(API_ENDPOINTS.WALLET.TRANSACTIONS, {
      params: { page, size },
    })
    .then((res) => res.data);
}

export function createTopup(amount: number) {
  return axiosClient
    .post<MomoPaymentResponse>(API_ENDPOINTS.WALLET.TOPUP, { amount })
    .then((res) => res.data);
}

export function createWithdrawal(payload: WithdrawalRequestPayload) {
  return axiosClient
    .post<WithdrawalResponse>(API_ENDPOINTS.WALLET.WITHDRAW, payload)
    .then((res) => res.data);
}
