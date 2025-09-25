import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { transactionSchema } from "@/lib/zodSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "invalid id" });

  if (req.method === "GET") {
    const item = await prisma.transaction.findUnique({ where: { id } });
    return res.json(item);
  }

  if (req.method === "PUT") {
    try {
      const parsed = transactionSchema.parse(req.body);
      const updated = await prisma.transaction.update({
        where: { id },
        data: {
          kind: parsed.kind,
          title: parsed.title,
          amount: parsed.amount,
          spendDate: new Date(parsed.spendDate),
        },
      });
      return res.json(updated);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }

  if (req.method === "DELETE") {
    await prisma.transaction.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
