import { prisma } from "./lib/prisma";

async function test() {
  await prisma.homeContent.findFirst();
}