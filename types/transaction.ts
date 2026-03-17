export interface Transaction {
  id: string;
  amount: number;
  status: "success" | "pending" | "failed";
  createdAt: string;
  customerName?: string;
  productName?: string;
}

export interface TransactionResponse {
  success: boolean;
  message?: string;
  data: Transaction[];
}
