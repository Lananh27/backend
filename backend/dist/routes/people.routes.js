"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = (0, express_1.Router)();
// GET all people (public)
router.get("/", async (_req, res) => {
    try {
        const people = await prisma_1.prisma.person.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({
            success: true,
            data: people,
        });
    }
    catch (error) {
        console.error("GET PEOPLE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch people",
        });
    }
});
// GET one person by id
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const person = await prisma_1.prisma.person.findUnique({
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
    }
    catch (error) {
        console.error("GET PERSON DETAIL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch person detail",
        });
    }
});
// CREATE person
router.post("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const { fullName, role, institution, email, cvLink, location, avatar, bio, } = req.body;
        const person = await prisma_1.prisma.person.create({
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
    }
    catch (error) {
        console.error("CREATE PERSON ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to create person",
        });
    }
});
// UPDATE person
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { fullName, role, institution, email, cvLink, location, avatar, bio, } = req.body;
        const person = await prisma_1.prisma.person.update({
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
    }
    catch (error) {
        console.error("UPDATE PERSON ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to update person",
        });
    }
});
// DELETE person
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.person.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: "Person deleted successfully",
        });
    }
    catch (error) {
        console.error("DELETE PERSON ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to delete person",
        });
    }
});
exports.default = router;
