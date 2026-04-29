"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const env_1 = require("../config/env");
const router = express_1.default.Router();
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email và password là bắt buộc" });
        }
        const user = await prisma_1.prisma.user.findFirst({
            where: { email: email.trim() },
        });
        if (!user) {
            return res.status(401).json({ message: "Sai email hoặc password" });
        }
        let isMatch = false;
        if (typeof user.password === "string" &&
            (user.password.startsWith("$2a$") ||
                user.password.startsWith("$2b$") ||
                user.password.startsWith("$2y$"))) {
            isMatch = await bcrypt_1.default.compare(password.trim(), user.password);
        }
        else {
            isMatch = password.trim() === user.password;
        }
        if (!isMatch) {
            return res.status(401).json({ message: "Sai email hoặc password" });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});
exports.default = router;
