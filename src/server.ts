import express from "express";
import mongoose from "mongoose";
import { meetingRoutes } from "./routes/meetingRoute";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { authMiddleware } from "./middlewares/auth";

const { PORT = 3000, MONGODB_URI = "mongodb://mongo:27017/meetingbot" } =
  process.env;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MeetingBot API" });
});

app.use("/api/meetings", authMiddleware, meetingRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
