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
function parseId(idParam) {
    const raw = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!raw)
        return null;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0)
        return null;
    return id;
}
function normalizeString(value) {
    if (typeof value !== "string")
        return undefined;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}
function parseDateValue(value) {
    if (typeof value !== "string" || !value.trim())
        return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;
    return date;
}
router.get("/", async (_req, res) => {
    try {
        const meetings = await prisma_1.prisma.meeting.findMany({
            orderBy: { startDate: "desc" },
        });
        return res.json(meetings);
    }
    catch (error) {
        console.error("GET /meetings error:", error);
        return res.status(500).json({ message: "Lỗi lấy danh sách meetings" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID meeting không hợp lệ" });
        }
        const meeting = await prisma_1.prisma.meeting.findUnique({
            where: { id },
        });
        if (!meeting) {
            return res.status(404).json({ message: "Không tìm thấy meeting" });
        }
        return res.json(meeting);
    }
    catch (error) {
        console.error("GET /meetings/:id error:", error);
        return res.status(500).json({ message: "Lỗi lấy chi tiết meeting" });
    }
});
router.post("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const title = normalizeString(req.body.title);
        const summary = normalizeString(req.body.summary);
        const location = normalizeString(req.body.location);
        const agendaFileUrl = normalizeString(req.body.agendaFileUrl);
        const reportFileUrl = normalizeString(req.body.reportFileUrl);
        const photosLink = normalizeString(req.body.photosLink);
        const heroImage = normalizeString(req.body.heroImage);
        const startDate = parseDateValue(req.body.startDate);
        const endDate = parseDateValue(req.body.endDate);
        if (!title || !startDate || !endDate) {
            return res.status(400).json({
                message: "Thiếu hoặc sai dữ liệu title, startDate, endDate",
            });
        }
        if (endDate < startDate) {
            return res.status(400).json({
                message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
            });
        }
        const newMeeting = await prisma_1.prisma.meeting.create({
            data: {
                title,
                summary,
                location,
                startDate,
                endDate,
                heroImage,
                agendaFileUrl,
                reportFileUrl,
                photosLink,
            },
        });
        return res.status(201).json(newMeeting);
    }
    catch (error) {
        console.error("POST /meetings error:", error);
        return res.status(500).json({ message: "Lỗi tạo meeting" });
    }
});
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID meeting không hợp lệ" });
        }
        const existing = await prisma_1.prisma.meeting.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({ message: "Meeting không tồn tại" });
        }
        const nextStartDate = req.body.startDate !== undefined
            ? parseDateValue(req.body.startDate)
            : existing.startDate;
        const nextEndDate = req.body.endDate !== undefined
            ? parseDateValue(req.body.endDate)
            : existing.endDate;
        if (!nextStartDate || !nextEndDate) {
            return res.status(400).json({
                message: "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ",
            });
        }
        if (nextEndDate < nextStartDate) {
            return res.status(400).json({
                message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
            });
        }
        const updatedMeeting = await prisma_1.prisma.meeting.update({
            where: { id },
            data: {
                title: req.body.title !== undefined
                    ? normalizeString(req.body.title) ?? existing.title
                    : existing.title,
                summary: req.body.summary !== undefined
                    ? normalizeString(req.body.summary)
                    : existing.summary,
                location: req.body.location !== undefined
                    ? normalizeString(req.body.location)
                    : existing.location,
                startDate: nextStartDate,
                endDate: nextEndDate,
                heroImage: req.body.heroImage !== undefined
                    ? normalizeString(req.body.heroImage)
                    : existing.heroImage,
                agendaFileUrl: req.body.agendaFileUrl !== undefined
                    ? normalizeString(req.body.agendaFileUrl)
                    : existing.agendaFileUrl,
                reportFileUrl: req.body.reportFileUrl !== undefined
                    ? normalizeString(req.body.reportFileUrl)
                    : existing.reportFileUrl,
                photosLink: req.body.photosLink !== undefined
                    ? normalizeString(req.body.photosLink)
                    : existing.photosLink,
            },
        });
        return res.json(updatedMeeting);
    }
    catch (error) {
        console.error("PUT /meetings/:id error:", error);
        return res.status(500).json({ message: "Lỗi cập nhật meeting" });
    }
});
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID meeting không hợp lệ" });
        }
        const existing = await prisma_1.prisma.meeting.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({ message: "Meeting không tồn tại" });
        }
        await prisma_1.prisma.meeting.delete({
            where: { id },
        });
        return res.json({ message: "Xóa meeting thành công" });
    }
    catch (error) {
        console.error("DELETE /meetings/:id error:", error);
        return res.status(500).json({ message: "Lỗi xóa meeting" });
    }
});
exports.default = router;
