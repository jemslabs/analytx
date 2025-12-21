import { prisma } from "@/lib/prisma";
import { hashApiKey } from "./tools";

export async function verifyBrandApiKey(req: Request) {
  let auth = req.headers.get("authorization");

  // 🔴 Fallback for Vercel proxy
  if (!auth) {
    const scHeaders = req.headers.get("x-vercel-sc-headers");
    if (scHeaders) {
      try {
        const parsed = JSON.parse(scHeaders);
        auth = parsed.Authorization || parsed.authorization;
      } catch {}
    }
  }

  console.log("AUTH FINAL:", auth);

  if (!auth) return null;

  const apiKey = auth.replace(/^Bearer\s+/i, "").trim();
  if (!apiKey) return null;

  const hashed = hashApiKey(apiKey);

  const brand = await prisma.brandProfile.findFirst({
    where: { apiKey: hashed },
  });

  return brand;
}
