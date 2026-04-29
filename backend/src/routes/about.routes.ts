import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

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
  } catch (error: any) {
    console.error("GET ABOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Lỗi lấy nội dung About",
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const content =
      typeof req.body?.content === "string" ? req.body.content : "";

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
    } else {
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
  } catch (error: any) {
    console.error("UPDATE ABOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Lỗi cập nhật About",
    });
  }
});

export default router;