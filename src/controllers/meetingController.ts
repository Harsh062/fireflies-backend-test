import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { meetingService } from "../services/meetingService";

export const meetingController = {
  getAllMeetings: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.userId!;
      const data = await meetingService.getAllMeetings(
        userId,
        Number(page),
        Number(limit)
      );
      res.status(200).json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  },

  createMeeting: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title, date, participants } = req.body;
      const userId = req.userId!;
      const newMeeting = await meetingService.createMeeting({
        userId,
        title,
        date,
        participants,
      });
      res.status(201).json(newMeeting);
    } catch (err) {
      next(err);
    }
  },

  getMeetingById: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const meeting = await meetingService.getMeetingById(id);

      if (!meeting) {
        res.status(404).json({
          message: "Meeting not found",
        });
        return;
      }

      if (meeting.userId !== userId) {
        res.status(403).json({
          status: "fail",
          message: "Unauthorized to view this meeting",
        });
        return;
      }

      res.status(200).json(meeting);
    } catch (err) {
      next(err);
    }
  },

  updateTranscript: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { transcript } = req.body;
      const userId = req.userId!;
      const updatedMeeting = await meetingService.updateTranscript(
        id,
        transcript
      );
      if (!updatedMeeting) {
        res.status(404).json({ message: "Meeting not found" });
        return;
      }
      if (updatedMeeting.userId !== userId) {
        res.status(403).json({
          status: "fail",
          message: "Unauthorized to update this meeting",
        });
        return;
      }
      res.status(200).json(updatedMeeting);
    } catch (err) {
      next(err);
    }
  },

  getStats: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const stats = await meetingService.getMeetingStats();
      res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  },

  summarizeMeeting: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: meetingId } = req.params;
      const userId = req.userId!;

      const result = await meetingService.summarizeMeeting(meetingId, userId);

      res.status(200).json({
        message: "Meeting summarized successfully",
        summary: result.summary,
        actionItems: result.actionItems,
      });
    } catch (err) {
      next(err);
    }
  },
};
