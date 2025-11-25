export function generateUniqueReferralCode() {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 10000–99999
}
