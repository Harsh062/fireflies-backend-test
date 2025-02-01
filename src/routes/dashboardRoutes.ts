import express from "express";
import { Types } from "mongoose";
import { dashboardController } from "../controllers/dashboardController.js";

// Interface for upcoming meetings data
interface UpcomingMeeting {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  participantCount: number;
}

// Interface for overdue tasks data
interface OverdueTask {
  _id: Types.ObjectId;
  title: string;
  dueDate: Date;
  meetingId: Types.ObjectId;
  meetingTitle: string;
}

// Interface defining the structure of dashboard response
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

// Route to fetch the dashboard data
router.get("/", dashboardController.getDashboard);

export { router as dashboardRoutes };
