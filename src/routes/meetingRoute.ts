import express from "express";
import { meetingController } from "../controllers/meetingController";
import { validate } from "../middlewares/validate";
import { meetingSchema } from "../schemas/meetingSchema";

export const router = express.Router();

// Fetch all meetings
router.get("/", meetingController.getAllMeetings);

// Create a new meeting with validation
router.post("/", validate(meetingSchema), meetingController.createMeeting);

// Get meeting statistics
router.get("/stats", meetingController.getStats);

// Retrieve a specific meeting by ID
router.get("/:id", meetingController.getMeetingById);

// Update the transcript of a meeting
router.put("/:id/transcript", meetingController.updateTranscript);

// Generate AI-powered summary and action items for a meeting
router.post("/:id/summarize", meetingController.summarizeMeeting);

export { router as meetingRoutes };
