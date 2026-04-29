"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = (0, express_1.Router)();
// GET public home content
router.get("/", async (_req, res) => {
    try {
        const home = await prisma_1.prisma.homeContent.findFirst({
            where: { slug: "main-home" },
        });
        return res.status(200).json({
            success: true,
            data: home,
        });
    }
    catch (error) {
        console.error("GET HOME ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch home content",
        });
    }
});
// UPDATE home content
router.put("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, async (req, res) => {
    try {
        const { siteName, headerLogo, welcomeTitle, welcomeText, marqueeText, heroImage, heroTitle, heroDescription, heroButtonText, heroButtonLink, heroSlides, infoItems, attentionItems, partnerLogos, projectsSectionTitle, projectsItems, mapsSectionTitle, mapsItems, footerMailingText, footerContactText, footerSocialText, footerLogo, } = req.body;
        const existingHome = await prisma_1.prisma.homeContent.findFirst({
            where: { slug: "main-home" },
        });
        let home;
        if (existingHome) {
            home = await prisma_1.prisma.homeContent.update({
                where: { id: existingHome.id },
                data: {
                    siteName,
                    headerLogo,
                    welcomeTitle,
                    welcomeText,
                    marqueeText,
                    heroImage,
                    heroTitle,
                    heroDescription,
                    heroButtonText,
                    heroButtonLink,
                    heroSlides,
                    infoItems,
                    attentionItems,
                    partnerLogos,
                    projectsSectionTitle,
                    projectsItems,
                    mapsSectionTitle,
                    mapsItems,
                    footerMailingText,
                    footerContactText,
                    footerSocialText,
                    footerLogo,
                },
            });
        }
        else {
            home = await prisma_1.prisma.homeContent.create({
                data: {
                    slug: "main-home",
                    siteName,
                    headerLogo,
                    welcomeTitle,
                    welcomeText,
                    marqueeText,
                    heroImage,
                    heroTitle,
                    heroDescription,
                    heroButtonText,
                    heroButtonLink,
                    heroSlides,
                    infoItems,
                    attentionItems,
                    partnerLogos,
                    projectsSectionTitle,
                    projectsItems,
                    mapsSectionTitle,
                    mapsItems,
                    footerMailingText,
                    footerContactText,
                    footerSocialText,
                    footerLogo,
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "Home content saved successfully",
            data: home,
        });
    }
    catch (error) {
        console.error("UPDATE HOME ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to save home content",
        });
    }
});
exports.default = router;
