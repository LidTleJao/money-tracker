import Link from "next/link";
import TransactionForm from "../components/TransactionForm";

export default function NewPage() {
  return (
    <>
      <Link className="btn btn-sm" href={`/transactions`}>
        กลับหน้า รายการ
      </Link>
      <h1 className="text-2xl font-bold mb-4">เพิ่มรายการ</h1>
      <TransactionForm />
    </>
  );
}
