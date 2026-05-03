import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeProjectBody(body: any) {
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim() || slugify(title);

  return {
    title,
    slug,
    subtitle: String(body.subtitle || "").trim(),
    description: String(body.description || "").trim(),

    // Nội dung bài viết chi tiết hiển thị trong /projects/[slug]
    content: String(body.content || "").trim(),

    bullets: Array.isArray(body.bullets)
      ? body.bullets.map((item: any) => String(item || "").trim()).filter(Boolean)
      : [],

    image: String(body.image || "").trim(),
    readMoreLink: String(body.readMoreLink || "").trim() || `/projects/${slug}`,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
    category: String(body.category || "Research").trim(),
    researchArea: String(body.researchArea || "General").trim(),
    status: String(body.status || "In Progress").trim(),
    yearRange: String(body.yearRange || "").trim(),
    membersCount: String(body.membersCount || "0").trim(),
  };
}

// GET /api/projects
router.get("/", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      data: projects,
    });
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    return res.status(500).json({ message: "Lỗi lấy danh sách projects" });
  }
});

// GET /api/projects/:slug
router.get("/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim();

    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy project" });
    }

    return res.json({
      data: project,
    });
  } catch (error) {
    console.error("GET PROJECT DETAIL ERROR:", error);
    return res.status(500).json({ message: "Lỗi lấy chi tiết project" });
  }
});

// POST /api/projects
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const data = normalizeProjectBody(req.body);

    if (!data.title) {
      return res.status(400).json({ message: "Vui lòng nhập tên project" });
    }

    const exists = await prisma.project.findUnique({
      where: { slug: data.slug },
    });

    const finalSlug = exists ? `${data.slug}-${Date.now()}` : data.slug;

    const project = await prisma.project.create({
      data: {
        ...data,
        slug: finalSlug,
        readMoreLink:
          data.readMoreLink && data.readMoreLink !== `/projects/${data.slug}`
            ? data.readMoreLink
            : `/projects/${finalSlug}`,
      },
    });

    return res.status(201).json({
      message: "Tạo project thành công",
      data: project,
    });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    return res.status(500).json({ message: "Lỗi tạo project" });
  }
});

// PUT /api/projects/:id
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const data = normalizeProjectBody(req.body);

    if (!data.title) {
      return res.status(400).json({ message: "Vui lòng nhập tên project" });
    }

    const oldProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!oldProject) {
      return res.status(404).json({ message: "Không tìm thấy project" });
    }

    const slugExists = await prisma.project.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id,
        },
      },
    });

    const finalSlug = slugExists ? `${data.slug}-${Date.now()}` : data.slug;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        slug: finalSlug,
        readMoreLink:
          data.readMoreLink && data.readMoreLink !== `/projects/${data.slug}`
            ? data.readMoreLink
            : `/projects/${finalSlug}`,
      },
    });

    return res.json({
      message: "Cập nhật project thành công",
      data: project,
    });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    return res.status(500).json({ message: "Lỗi cập nhật project" });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const oldProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!oldProject) {
      return res.status(404).json({ message: "Không tìm thấy project" });
    }

    await prisma.project.delete({
      where: { id },
    });

    return res.json({
      message: "Xóa project thành công",
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return res.status(500).json({ message: "Lỗi xóa project" });
  }
});

export default router;