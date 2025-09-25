"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TransactionForm from "@/app/components/TransactionForm";
import { Transaction } from "@/lib/zodSchemas";

export default function EditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [initial, setInitial] = useState<Transaction>();
  useEffect(() => {
    if (id) {
      fetch(`/api/transaction/${id}`)
        .then((r) => r.json())
        .then(setInitial);
    }
  }, [id]);
  if (!initial) return <div>Loading...</div>;
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">แก้ไขรายการ</h1>
      <TransactionForm initial={initial} />
    </>
  );
}
