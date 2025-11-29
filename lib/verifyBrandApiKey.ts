import { prisma } from "@/lib/prisma";
import { hashApiKey } from "./tools";

export async function verifyBrandApiKey(req: Request) {
  const auth = req.headers.get("authorization");
  const apiKey = auth?.replace("Bearer ", "");

  if (!apiKey) return null;

  const hashed = hashApiKey(apiKey);

  const brand = await prisma.brandProfile.findFirst({
    where: { apiKey: hashed },
  });

  return brand;
}
