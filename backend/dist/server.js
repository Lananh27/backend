"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const meeting_routes_1 = __importDefault(require("./routes/meeting.routes"));
const announcement_routes_1 = __importDefault(require("./routes/announcement.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const home_routes_1 = __importDefault(require("./routes/home.routes"));
const about_routes_1 = __importDefault(require("./routes/about.routes"));
const people_routes_1 = __importDefault(require("./routes/people.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/meetings", meeting_routes_1.default);
app.use("/api/announcements", announcement_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/home", home_routes_1.default);
app.use("/api/about", about_routes_1.default);
app.use("/api/people", people_routes_1.default);
app.get("/", (_req, res) => {
    return res.json({ message: "Backend is running" });
});
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
