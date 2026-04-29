"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./lib/prisma");
async function test() {
    await prisma_1.prisma.homeContent.findFirst();
}
