import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Kiểm tra header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Tách token từ header
    const token = authHeader.split(" ")[1];
    
    // Xác thực và giải mã token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = decoded; // Lưu thông tin người dùng vào request
    next(); // Tiếp tục xử lý yêu cầu API
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};