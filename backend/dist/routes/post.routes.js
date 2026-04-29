"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/posts", auth_middleware_1.authMiddleware, async (req, res) => {
    const { title, slug, content, coverImage } = req.body;
    // Xử lý tạo bài viết
    try {
        const post = await prisma_1.prisma.post.create({
            data: {
                title,
                slug,
                content,
                coverImage, // Lưu file ảnh nếu có
            },
        });
        return res.status(201).json({ success: true, data: post });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Tạo bài thất bại" });
    }
});
exports.default = router;
