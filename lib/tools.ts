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
