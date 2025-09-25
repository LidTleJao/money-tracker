import { PrismaClient, Kind } from "@prisma/client";
import { addDays, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  await prisma.transaction.deleteMany();
  const now = new Date();
  const months = [
    new Date(now.getFullYear(), now.getMonth() - 1, 1), // เดือนก่อน
    new Date(now.getFullYear(), now.getMonth() - 2, 1), // ก่อนหน้าอีก 1
  ];

  for (const base of months) {
    const start = startOfMonth(base);
    const items = [];
    for (let i = 0; i < 20; i++) {
      const isIncome = Math.random() < 0.35;
      //   items.push({
      //     kind: isIncome ? "INCOME" : "EXPENSE", // ใช้ string ตาม enum ใน schema
      //     title: isIncome
      //       ? `รายรับงานฟรีแลนซ์ #${i + 1}`
      //       : `ค่าใช้จ่ายทั่วไป #${i + 1}`,
      //     amount: (isIncome ? rand(500, 3000) : rand(50, 800)).toFixed(2),
      //     spendDate: addDays(start, rand(0, 27)),
      //   });
      items.push({
        kind: isIncome ? Kind.INCOME : Kind.EXPENSE, // ✅ ใช้ enum
        title: isIncome
          ? `รายรับงานฟรีแลนซ์ #${i + 1}`
          : `ค่าใช้จ่ายทั่วไป #${i + 1}`,
        amount: (isIncome ? rand(500, 3000) : rand(50, 800)).toFixed(2),
        spendDate: addDays(start, rand(0, 27)),
      });
    }
    await prisma.transaction.createMany({ data: items });
  }

  console.log("✅ Seeded 2 months x 20 records");
}

main().finally(() => prisma.$disconnect());
