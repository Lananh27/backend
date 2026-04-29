import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import multer from "multer";
import path from "path";

const router = Router();

router.post("/posts", authMiddleware, async (req: Request, res: Response) => {
  const { title, slug, content, coverImage } = req.body;

  // Xử lý tạo bài viết
  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage, // Lưu file ảnh nếu có
      },
    });

    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Tạo bài thất bại" });
  }
});

export default router;