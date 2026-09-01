export type WalletTransactionType = "TOPUP" | "WITHDRAW" | "COURSE_PAYMENT" | "REFUND";

export type WalletTransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export type PaymentMethod = "WALLET" | "MOMO";

export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type WalletResponse = {
  id: number;
  userId: number;
  balance: number;
  updatedAt: string;
};

export type WalletTransactionResponse = {
  id: number;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  method: PaymentMethod | null;
  amount: number;
  courseId: number | null;
  courseTitle: string | null;
  momoOrderId: string | null;
  note: string | null;
  createdAt: string;
  username: string;
  userEmail: string;
};

export type MomoPaymentResponse = {
  orderId: string;
  payUrl: string;
  amount: number;
};

export type WithdrawalRequestPayload = {
  amount: number;
  momoPhoneNumber: string;
};

export type WithdrawalResponse = {
  id: number;
  userId: number;
  username: string;
  amount: number;
  momoPhoneNumber: string;
  status: WithdrawalStatus;
  adminNote: string | null;
  requestedAt: string;
  processedAt: string | null;
};

export type BudgetOverviewResponse = {
  totalRevenue: number;
  totalWalletBalance: number;
  pendingWithdrawalsCount: number;
  pendingWithdrawalsAmount: number;
  totalTopupAmount: number;
  totalWithdrawnAmount: number;
};
