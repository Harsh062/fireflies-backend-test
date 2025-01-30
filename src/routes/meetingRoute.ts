import express from "express";
import { meetingController } from "../controllers/meetingController";
import { Meeting } from "../models/meeting.js";
import { AuthenticatedRequest } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { meetingSchema } from "../schemas/meetingSchema";

export const router = express.Router();

// GET all meetings for user
router.get("/", meetingController.getAllMeetings);
router.post("/", validate(meetingSchema), meetingController.createMeeting);
router.get("/:id", meetingController.getMeetingById);
router.put("/:id/transcript", meetingController.updateTranscript);
router.get("/stats", meetingController.getStats);

export { router as meetingRoutes };
