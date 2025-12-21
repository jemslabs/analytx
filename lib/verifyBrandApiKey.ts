import { prisma } from "@/lib/prisma";
import { hashApiKey } from "./tools";

export async function verifyBrandApiKey(req: any) { 
  // Use 'any' or NextApiRequest if using Next.js API route
  // In Next.js Node API, headers are a plain object, not a Request object

  // Log all headers to debug
  console.log("HEADERS:", req.headers);

  // Authorization header (Next.js lowercase)
  const auth = req.headers.authorization;
  console.log("AUTH HEADER:", auth);

  if (!auth) return null; // No auth header sent

  // Robust parsing for "Bearer <token>"
  const apiKey = auth.replace(/^Bearer\s+/i, "").trim();
  console.log("API KEY:", apiKey);

  if (!apiKey) return null;

  // Hash and find brand
  const hashed = hashApiKey(apiKey);
  console.log("HASHED API KEY:", hashed);

  const brand = await prisma.brandProfile.findFirst({
    where: { apiKey: hashed },
  });

  console.log("BRAND FOUND:", brand);

  return brand;
}
