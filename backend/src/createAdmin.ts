import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";

async function main() {
  const email = "admin@gmail.com";
  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Updated existing admin:");
    console.log({ email, password: plainPassword, role: "ADMIN" });
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Created new admin:");
    console.log({ email, password: plainPassword, role: "ADMIN" });
  }
}

main()
  .catch((error) => {
    console.error("CREATE ADMIN ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });