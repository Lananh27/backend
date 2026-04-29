import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import meetingRoutes from "./routes/meeting.routes";
import announcementRoutes from "./routes/announcement.routes";
import uploadRoutes from "./routes/upload.routes";
import homeRoutes from "./routes/home.routes";
import aboutRoutes from "./routes/about.routes";
import peopleRoutes from "./routes/people.routes";


const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/people", peopleRoutes);


app.get("/", (_req, res) => {
  return res.json({ message: "Backend is running" });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});