import express from "express";
import { meetingController } from "../controllers/meetingController";
import { validate } from "../middlewares/validate";
import { meetingSchema } from "../schemas/meetingSchema";

export const router = express.Router();

router.get("/", meetingController.getAllMeetings);
router.post("/", validate(meetingSchema), meetingController.createMeeting);
router.get("/stats", meetingController.getStats);
router.get("/:id", meetingController.getMeetingById);
router.put("/:id/transcript", meetingController.updateTranscript);
router.post("/:id/summarize", meetingController.summarizeMeeting);

export { router as meetingRoutes };
