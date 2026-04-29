import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const people = await prisma.person.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: people,
    });
  } catch (error: any) {
    console.error("GET PEOPLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch people",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const person = await prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: person,
    });
  } catch (error: any) {
    console.error("GET PERSON DETAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch person detail",
    });
  }
});

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        role,
        institution,
        email,
        cvLink,
        location,
        avatar,
        bio,
      } = req.body;

      const person = await prisma.person.create({
        data: {
          fullName,
          role,
          institution,
          email,
          cvLink,
          location,
          avatar,
          bio,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Person created successfully",
        data: person,
      });
    } catch (error: any) {
      console.error("CREATE PERSON ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Failed to create person",
      });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const {
        fullName,
        role,
        institution,
        email,
        cvLink,
        location,
        avatar,
        bio,
      } = req.body;

      const person = await prisma.person.update({
        where: { id },
        data: {
          fullName,
          role,
          institution,
          email,
          cvLink,
          location,
          avatar,
          bio,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Person updated successfully",
        data: person,
      });
    } catch (error: any) {
      console.error("UPDATE PERSON ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Failed to update person",
      });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await prisma.person.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Person deleted successfully",
      });
    } catch (error: any) {
      console.error("DELETE PERSON ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Failed to delete person",
      });
    }
  }
);

export default router;