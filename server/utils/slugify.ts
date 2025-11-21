import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export function makeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }).slice(0, 240);
}

export async function generateUniqueBrandSlug(prisma: PrismaClient, name: string) {
  const base = makeSlug(name);
  let unique = base;
  let counter = 1;

  while (true) {
    const exists = await prisma.brandProfile.findUnique({
      where: { slug: unique },
    });

    if (!exists) break;

    unique = `${base}-${counter}`;
    counter++;
  }

  return unique;
}
