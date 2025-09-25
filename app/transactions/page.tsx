"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MonthPicker from "../components/MonthPicker";
import { TransactionListResponse } from "@/lib/zodSchemas";

export default function TransactionsPage() {
  const params = useSearchParams();
  const month = params?.get("month") || new Date().toISOString().slice(0, 7);
  const [data, setData] = useState<TransactionListResponse>();

  useEffect(() => {
    fetch(`/api/transactions?month=${month}`)
      .then((r) => r.json())
      .then(setData);
  }, [month]);

  async function del(id: number) {
    if (!confirm("ลบรายการนี้?")) return;
    await fetch(`/api/transaction/${id}`, { method: "DELETE" });
    setData((d) =>
      d ? { ...d, items: d.items.filter((i) => i.id !== id) } : d
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">รายการรายรับรายจ่าย</h1>
        <Link className="btn btn-primary" href="/transactionsCreate">
          + เพิ่มรายการ
        </Link>
      </div>
      <MonthPicker />

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">รายรับ</div>
          <div className="stat-value">฿{data?.report.income?.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">รายจ่าย</div>
          <div className="stat-value">฿{data?.report.expense?.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">คงเหลือ</div>
          <div className="stat-value">฿{data?.report.balance?.toFixed(2)}</div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>ประเภท</th>
            <th>รายการ</th>
            <th className="text-right">จำนวนเงิน</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((it) => (
            <tr key={it.id}>
              <td>{it.spendDate.slice(0, 10)}</td>
              <td>{it.kind === "INCOME" ? "รายรับ" : "รายจ่าย"}</td>
              <td>{it.title}</td>
              <td className="text-right">฿{Number(it.amount).toFixed(2)}</td>
              <td className="text-right space-x-2">
                <Link className="btn btn-sm" href={`/transaction/${it.id}`}>
                  แก้ไข
                </Link>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => del(it.id)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
