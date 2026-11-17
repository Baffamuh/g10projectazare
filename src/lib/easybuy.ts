export const DOWN_OPTIONS = [20, 30, 50] as const;
export const MONTH_OPTIONS = [3, 6, 12, 24] as const;

export function easyBuyPlan(price: number, downPct: number, months: number) {
  const down = Math.round((price * downPct) / 100);
  const balance = Math.max(0, price - down);
  const monthly = months > 0 ? Math.ceil(balance / months) : balance;
  return { down, balance, monthly, total: price, interest: 0 };
}
