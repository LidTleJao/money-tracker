"use client";
import { useEffect, useState } from "react";
import { TransactionListResponse } from "@/lib/zodSchemas";
// import MonthPicker from "../app/components/MonthPicker";

export default function Dashboard(){
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [data, setData] = useState<TransactionListResponse>();
  useEffect(()=>{ fetch(`/api/transactions?month=${month}`).then(r=>r.json()).then(setData); },[month]);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">สรุปผลรายเดือน</h1>
      <input type="month" className="input input-bordered" value={month} onChange={e=>setMonth(e.target.value)} />
      <div className="stats shadow">
        <div className="stat"><div className="stat-title">รายรับ</div><div className="stat-value">฿{data?.report?.income?.toFixed(2)}</div></div>
        <div className="stat"><div className="stat-title">รายจ่าย</div><div className="stat-value">฿{data?.report?.expense?.toFixed(2)}</div></div>
        <div className="stat"><div className="stat-title">ยอดคงเหลือ</div><div className="stat-value">฿{data?.report?.balance?.toFixed(2)}</div></div>
      </div>
    </div>
  )
}
