import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

import authRoutes from "./routes/auth.routes";
import meetingRoutes from "./routes/meeting.routes";
import announcementRoutes from "./routes/announcement.routes";
import uploadRoutes from "./routes/upload.routes";
import homeRoutes from "./routes/home.routes";
import aboutRoutes from "./routes/about.routes";
import peopleRoutes from "./routes/people.routes";
import educationRoutes from "./routes/education.routes";
import dataRoutes from "./routes/data.routes";
import libraryRoutes from "./routes/library.routes";
import registrationRoutes from "./routes/registration.routes";
import projectRoutes from "./routes/project.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin: Postman, mobile app, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (_req, res) => {
  return res.json({ message: "Backend is running" });
});

app.get("/api", (_req, res) => {
  return res.json({
    message: "API is running",
    routes: [
      "/api/auth",
      "/api/meetings",
      "/api/announcements",
      "/api/upload",
      "/api/home",
      "/api/about",
      "/api/people",
      "/api/education",
      "/api/data",
      "/api/library",
      "/api/registrations",
      "/api/projects",
      "/api/debug/project-columns",
      "/api/debug/database-url",
    ],
  });
});

/**
 * DEBUG TEMP:
 * Dùng để kiểm tra database Render hiện tại có cột content trong bảng Project chưa.
 * Sau khi fix xong có thể xóa 2 route debug này.
 */
app.get("/api/debug/project-columns", async (_req, res) => {
  try {
    const columns = await prisma.$queryRaw<
      Array<{
        column_name: string;
        data_type: string;
        is_nullable: string;
        column_default: string | null;
      }>
    >`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'Project'
      ORDER BY ordinal_position
    `;

    return res.status(200).json({
      success: true,
      table: "Project",
      hasContentColumn: columns.some((col) => col.column_name === "content"),
      columns,
    });
  } catch (error: any) {
    console.error("DEBUG PROJECT COLUMNS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || String(error),
    });
  }
});

/**
 * DEBUG TEMP:
 * Không trả full DATABASE_URL để tránh lộ password.
 * Chỉ trả host/database name để so với link bạn đã chạy SQL.
 */
app.get("/api/debug/database-url", (_req, res) => {
  try {
    const rawUrl = process.env.DATABASE_URL || "";

    if (!rawUrl) {
      return res.status(500).json({
        success: false,
        message: "DATABASE_URL is missing",
      });
    }

    const parsed = new URL(rawUrl);

    return res.status(200).json({
      success: true,
      protocol: parsed.protocol,
      host: parsed.hostname,
      port: parsed.port,
      database: parsed.pathname.replace("/", ""),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || String(error),
    });
  }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});