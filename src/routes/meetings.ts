import express from "express";
import { Meeting } from "../models/meeting.js";
import { AuthenticatedRequest } from "../auth.middleware.js";

export const router = express.Router();

// GET all meetings for user
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const meetings = await Meeting.find();
    res.json({
      total: meetings.length,
      limit: req.query.limit,
      page: req.query.page,
      data: meetings,
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// POST - Create a new meeting
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { title, date, participants } = req.body;
    const newMeeting = new Meeting({
      userId: req.userId,
      title,
      date,
      participants,
      transcript: "",
      summary: "",
      duration: 0,
      actionItems: [],
    });
    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// GET - Retrieve a specific meeting by ID (include tasks if available)
router.get("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.put("/:id/transcript", async (req: AuthenticatedRequest, res) => {
  try {
    const { transcript } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { transcript },
      { new: true }
    );

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.get("/stats", async (req: AuthenticatedRequest, res) => {
  try {
    const stats = {
      generalStats: {
        totalMeetings: 100,
        averageParticipants: 4.75,
        totalParticipants: 475,
        shortestMeeting: 15,
        longestMeeting: 120,
        averageDuration: 45.3,
      },
      topParticipants: [
        { participant: "John Doe", meetingCount: 20 },
        { participant: "Jane Smith", meetingCount: 18 },
        { participant: "Bob Johnson", meetingCount: 15 },
        { participant: "Alice Brown", meetingCount: 12 },
        { participant: "Charlie Davis", meetingCount: 10 },
      ],
      meetingsByDayOfWeek: [
        { dayOfWeek: 1, count: 10 },
        { dayOfWeek: 2, count: 22 },
        { dayOfWeek: 3, count: 25 },
        { dayOfWeek: 4, count: 20 },
        { dayOfWeek: 5, count: 18 },
        { dayOfWeek: 6, count: 5 },
        { dayOfWeek: 7, count: 0 },
      ],
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export { router as meetingRoutes };
