"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("./lib/prisma");
async function main() {
    const email = "admin@gmail.com";
    const plainPassword = "123456";
    const hashedPassword = await bcrypt_1.default.hash(plainPassword, 10);
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: { email },
    });
    if (existingUser) {
        await prisma_1.prisma.user.update({
            where: { id: existingUser.id },
            data: {
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        console.log("Updated existing admin:");
        console.log({ email, password: plainPassword, role: "ADMIN" });
    }
    else {
        await prisma_1.prisma.user.create({
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
    await prisma_1.prisma.$disconnect();
});
