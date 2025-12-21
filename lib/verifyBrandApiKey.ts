import { prisma } from "@/lib/prisma";
import { hashApiKey } from "./tools";

export async function verifyBrandApiKey(req: Request) {
  const apiKey = req.headers.get("x-analytx-api-key");

  console.log("API KEY HEADER:", apiKey);

  if (!apiKey) return null;

  const hashed = hashApiKey(apiKey);

  const brand = await prisma.brandProfile.findFirst({
    where: { apiKey: hashed },
  });

  return brand;
}
