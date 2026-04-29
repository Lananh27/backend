"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // Kiểm tra header Authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Tách token từ header
        const token = authHeader.split(" ")[1];
        // Xác thực và giải mã token
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng vào request
        next(); // Tiếp tục xử lý yêu cầu API
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
