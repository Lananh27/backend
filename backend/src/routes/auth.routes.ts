import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và password là bắt buộc" });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.trim() },
    });

    if (!user) {
      return res.status(401).json({ message: "Sai email hoặc password" });
    }

    let isMatch = false;

    if (
      typeof user.password === "string" &&
      (user.password.startsWith("$2a$") ||
        user.password.startsWith("$2b$") ||
        user.password.startsWith("$2y$"))
    ) {
      isMatch = await bcrypt.compare(password.trim(), user.password);
    } else {
      isMatch = password.trim() === user.password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Sai email hoặc password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;