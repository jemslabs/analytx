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
// let payout = 0;

// if (campaign.payoutModel === "CPS" || campaign.payoutModel === "BOTH") {
//   payout += campaign.cpsCommissionType === "PERCENTAGE"
//     ? sale.salePrice * (campaign.cpsValue / 100)
//     : campaign.cpsValue;
// }

// if (campaign.payoutModel === "CPC" || campaign.payoutModel === "BOTH") {
//   payout += clicks * campaign.cpcValue;
// }
