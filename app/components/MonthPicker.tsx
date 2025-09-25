"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function MonthPicker() {
  const router = useRouter();
  const params = useSearchParams();
  const month = params?.get("month") || new Date().toISOString().slice(0, 7);
  return (
    <input
      type="month"
      className="input input-bordered"
      value={month}
      onChange={(e) => router.push(`/transactions?month=${e.target.value}`)}
    />
  );
}
