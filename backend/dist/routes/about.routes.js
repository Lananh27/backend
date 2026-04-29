"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", async (_req, res) => {
    try {
        let about = await prisma.aboutContent.findFirst({
            where: { slug: "main-about" },
        });
        if (!about) {
            about = await prisma.aboutContent.create({
                data: {
                    slug: "main-about",
                    content: "",
                },
            });
        }
        return res.json({
            success: true,
            data: about,
        });
    }
    catch (error) {
        console.error("GET ABOUT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Lỗi lấy nội dung About",
        });
    }
});
router.put("/", async (req, res) => {
    try {
        const content = typeof req.body?.content === "string" ? req.body.content : "";
        const existing = await prisma.aboutContent.findFirst({
            where: { slug: "main-about" },
        });
        let about;
        if (existing) {
            about = await prisma.aboutContent.update({
                where: { id: existing.id },
                data: {
                    content,
                },
            });
        }
        else {
            about = await prisma.aboutContent.create({
                data: {
                    slug: "main-about",
                    content,
                },
            });
        }
        return res.json({
            success: true,
            message: "Lưu About thành công",
            data: about,
        });
    }
    catch (error) {
        console.error("UPDATE ABOUT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Lỗi cập nhật About",
        });
    }
});
exports.default = router;
