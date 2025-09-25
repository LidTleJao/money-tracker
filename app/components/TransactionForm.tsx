"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { transactionSchema } from "@/lib/zodSchemas";

interface InitialTransaction {
  id?: number;
  kind: "INCOME" | "EXPENSE";
  title: string;
  amount: string | number | { toString: () => string };
  spendDate: string;
}

export default function TransactionForm({
  initial,
}: {
  initial?: InitialTransaction;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    kind: initial?.kind ?? "EXPENSE",
    title: initial?.title ?? "",
    amount: initial?.amount?.toString?.() ?? "",
    spendDate: initial?.spendDate
      ? initial.spendDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  });

  async function save() {
    const parsed = transactionSchema.safeParse(form);
    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }
    const method = initial ? "PUT" : "POST";
    const url = initial
      ? `/api/transaction/${initial.id}`
      : `/api/transactions`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert("บันทึกไม่สำเร็จ");
      return;
    }
    router.push("/transactions");
  }

  return (
    <div className="space-y-3 max-w-md">
      <select
        className="select select-bordered w-full"
        value={form.kind}
        onChange={(e) =>
          setForm((s) => ({
            ...s,
            kind: e.target.value as "INCOME" | "EXPENSE",
          }))
        }
      >
        <option value="INCOME">รายรับ</option>
        <option value="EXPENSE">รายจ่าย</option>
      </select>
      <input
        className="input input-bordered w-full"
        placeholder="ชื่อรายการ"
        value={form.title}
        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
      />
      <input
        className="input input-bordered w-full"
        placeholder="จำนวนเงิน (0.00)"
        value={form.amount}
        onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
      />
      <input
        className="input input-bordered w-full"
        type="date"
        value={form.spendDate}
        onChange={(e) => setForm((s) => ({ ...s, spendDate: e.target.value }))}
      />
      <button className="btn btn-primary w-full" onClick={save}>
        บันทึก
      </button>
    </div>
  );
}
