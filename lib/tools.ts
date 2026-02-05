
import crypto from "crypto";

export function generateUniqueReferralCode() {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 10000–99999
}

export function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}
export function hashApiKey(apiKey: string) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export function topNWithOther<T extends Record<string, any>>(
  items: T[],
  metricKey: keyof T,
  n = 3,
  otherLabel = "Other"
) {
  const sorted = [...items].sort(
    (a, b) => (b[metricKey] as number) - (a[metricKey] as number)
  );

  const top = sorted.slice(0, n);
  const rest = sorted.slice(n);

  if (rest.length === 0) return top;

  const otherValue = rest.reduce(
    (sum, item) => sum + (item[metricKey] as number),
    0
  );

  return [
    ...top,
    {
      ...Object.fromEntries(Object.keys(top[0]).map((k) => [k, 0])),
      name: otherLabel,
      [metricKey]: otherValue,
    },
  ];
}
export function applyCoupon(
  baseAmount: number,
  couponCode?: string
) {
  if (!couponCode) {
    return { finalAmount: baseAmount, applied: false };
  }

  const normalized = couponCode.toUpperCase();

  // FESTIVAL COUPON
  if (normalized === "NEWYEAR30") {
    const expiry = new Date("2026-01-07T23:59:59");

    if (new Date() > expiry) {
      throw new Error("Coupon expired");
    }

    const discount = Math.floor(baseAmount * 0.3);

    return {
      finalAmount: baseAmount - discount,
      applied: true,
      discountPercent: 30,
      coupon: "NEWYEAR30",
    };
  }

  throw new Error("Invalid coupon code");
}
