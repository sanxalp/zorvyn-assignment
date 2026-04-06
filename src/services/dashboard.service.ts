import prisma from "../db/prisma";

export const getDashboardSummary = async () => {
  const [
    totalIncomeResult,
    totalExpenseResult,
    categoryTotalsResult,
    recentActivity
  ] = await Promise.all([
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    }),
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    }),
    prisma.record.groupBy({
      by: ["category"],
      _sum: { amount: true },
      // You could filter by type: EXPENSE here if you only want expense categories
    }),
    prisma.record.findMany({
      take: 5,
      orderBy: { date: "desc" },
      select: {
        id: true,
        type: true,
        category: true,
        amount: true,
        date: true,
      }
    })
  ]);

  const totalIncome = totalIncomeResult._sum.amount || 0;
  const totalExpense = totalExpenseResult._sum.amount || 0;
  const netBalance = totalIncome - totalExpense;

  const categoryTotals = categoryTotalsResult.map(c => ({
    category: c.category,
    amount: c._sum.amount || 0,
  }));

  return {
    summary: {
      totalIncome,
      totalExpense,
      netBalance,
    },
    categoryTotals,
    recentActivity,
  };
};
