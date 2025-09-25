import { z } from "zod";

export const transactionSchema = z.object({
  kind: z.enum(["INCOME", "EXPENSE"]),
  title: z.string().min(1).max(200),
  amount: z
    .string()
    .refine(v => /^\d+(\.\d{1,2})?$/.test(v), "จำนวนเงินต้องทศนิยมไม่เกิน 2 ตำแหน่ง"),
  spendDate: z.string().refine(v => !Number.isNaN(Date.parse(v)), "วันที่ไม่ถูกต้อง"),
});
export type TransactionInput = z.infer<typeof transactionSchema>;

// TypeScript interfaces for API responses and component props
export interface Transaction {
  id: number;
  kind: "INCOME" | "EXPENSE";
  title: string;
  amount: string | number;
  spendDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionReport {
  income: number;
  expense: number;
  balance: number;
}

export interface TransactionListResponse {
  items: Transaction[];
  report: TransactionReport;
}
