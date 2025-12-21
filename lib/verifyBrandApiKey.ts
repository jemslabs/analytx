import { prisma } from "@/lib/prisma";
import { hashApiKey } from "./tools";

export async function verifyBrandApiKey(req: Request) {
  const auth = req.headers.get("authorization");
    console.log(auth)
  const apiKey = auth?.replace("Bearer ", "");
  console.log(apiKey)
  if (!apiKey) return null;

  const hashed = hashApiKey(apiKey);
console.log(hashed)
  const brand = await prisma.brandProfile.findFirst({
    where: { apiKey: hashed },
  });
console.log(brand)
  return brand;
}
