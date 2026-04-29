"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = express_1.default.Router();
router.get("/", async (_req, res) => {
    try {
        const announcements = await prisma_1.prisma.announcement.findMany({
            orderBy: { publishedAt: "desc" },
        });
        return res.json(announcements);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi lấy danh sách announcements" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const announcement = await prisma_1.prisma.announcement.findUnique({
            where: { id },
        });
        if (!announcement) {
            return res.status(404).json({ message: "Không tìm thấy announcement" });
        }
        return res.json(announcement);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi lấy chi tiết announcement" });
    }
});
router.post("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Thiếu title hoặc content" });
        }
        const newAnnouncement = await prisma_1.prisma.announcement.create({
            data: {
                title,
                content,
                imageUrl,
            },
        });
        return res.status(201).json(newAnnouncement);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi tạo announcement" });
    }
});
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content, imageUrl } = req.body;
        const existing = await prisma_1.prisma.announcement.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({ message: "Announcement không tồn tại" });
        }
        const updatedAnnouncement = await prisma_1.prisma.announcement.update({
            where: { id },
            data: {
                title: title ?? existing.title,
                content: content ?? existing.content,
                imageUrl: imageUrl ?? existing.imageUrl,
            },
        });
        return res.json(updatedAnnouncement);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi cập nhật announcement" });
    }
});
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existing = await prisma_1.prisma.announcement.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({ message: "Announcement không tồn tại" });
        }
        await prisma_1.prisma.announcement.delete({
            where: { id },
        });
        return res.json({ message: "Xóa announcement thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi xóa announcement" });
    }
});
exports.default = router;
