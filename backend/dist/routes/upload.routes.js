"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Định nghĩa đường dẫn lưu trữ file upload
const router = (0, express_1.Router)();
const uploadDir = path_1.default.join(process.cwd(), "uploads");
// Tạo thư mục nếu chưa tồn tại
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Cấu hình multer để xử lý file upload
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, ext).replace(/\s+/g, "-");
        cb(null, `${Date.now()}-${baseName}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Route để tải lên file
router.post("/", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Không có file được tải lên" });
        }
        return res.status(200).json({
            message: "Upload thành công",
            url: `/uploads/${req.file.filename}`,
        });
    }
    catch (error) {
        console.error("UPLOAD ERROR:", error);
        return res.status(500).json({ message: "Upload thất bại" });
    }
});
// Thêm route lấy bài viết theo ID
router.get("/post/:id", (req, res) => {
    const { id } = req.params;
    // Giả sử bạn có một cơ sở dữ liệu (hoặc file) lưu trữ bài viết
    // Dưới đây là một ví dụ giả lập dữ liệu bài viết từ một file JSON
    const posts = [
        { id: "1", title: "Bài viết 1", content: "Nội dung bài viết 1" },
        { id: "2", title: "Bài viết 2", content: "Nội dung bài viết 2" },
    ];
    const post = posts.find((post) => post.id === id);
    if (!post) {
        return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.json(post);
});
exports.default = router;
