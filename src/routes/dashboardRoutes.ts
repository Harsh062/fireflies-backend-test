import express from "express";
import { Types } from "mongoose";
import { dashboardController } from "../controllers/dashboardController.js";

interface UpcomingMeeting {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  participantCount: number;
}

interface OverdueTask {
  _id: Types.ObjectId;
  title: string;
  dueDate: Date;
  meetingId: Types.ObjectId;
  meetingTitle: string;
}

interface DashboardData {
  totalMeetings: number;
  taskSummary: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  upcomingMeetings: UpcomingMeeting[];
  overdueTasks: OverdueTask[];
}

const router = express.Router();

router.get("/", dashboardController.getDashboard);

export { router as dashboardRoutes };
