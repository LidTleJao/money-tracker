import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { transactionSchema } from "@/lib/zodSchemas";
import { startOfMonth, endOfMonth } from "date-fns";

interface TransactionItem {
  id: number;
  kind: "INCOME" | "EXPENSE";
  title: string;
  amount: string | number; // Handle Decimal type conversion
  spendDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // ?month=YYYY-MM (เช่น 2025-08)
    const month = (req.query.month as string) || "";
    const where: { spendDate?: { gte: Date; lte: Date } } = {};
    if (/^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split("-").map(Number);
      where.spendDate = {
        gte: startOfMonth(new Date(y, m - 1, 1)),
        lte: endOfMonth(new Date(y, m - 1, 1)),
      };
    }
    const items = (await prisma.transaction.findMany({
      where,
      orderBy: [{ spendDate: "asc" }, { id: "asc" }],
    })) as TransactionItem[];

    // รายงานสรุป
    const income = items
      .filter((i: TransactionItem) => i.kind === "INCOME")
      .reduce((a: number, b: TransactionItem) => a + Number(b.amount), 0);
    const expense = items
      .filter((i: TransactionItem) => i.kind === "EXPENSE")
      .reduce((a: number, b: TransactionItem) => a + Number(b.amount), 0);
    const balance = income - expense;

    return res.json({ items, report: { income, expense, balance } });
  }

  if (req.method === "POST") {
    try {
      const parsed = transactionSchema.parse(req.body);
      const created = await prisma.transaction.create({
        data: {
          kind: parsed.kind,
          title: parsed.title,
          amount: parsed.amount,
          spendDate: new Date(parsed.spendDate),
        },
      });
      return res.status(201).json(created);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      return res.status(400).json({ error: errorMessage });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
