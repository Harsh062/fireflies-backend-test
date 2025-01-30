import { Meeting } from "../models/meeting";
import { Task } from "../models/task";
import { db } from "./db";

export const dashboardRepo = {
  // Fetch upcoming meetings for the user
  getUpcomingMeetings: async (userId: string) => {
    return db
      .findWithProjection(
        Meeting,
        {
          userId,
          date: { $gte: new Date() }, // Only future meetings
        },
        {
          _id: 1,
          title: 1,
          date: 1,
          participants: 1, // Needed for participantCount
        }
      )
      .sort({ date: 1 })
      .limit(5); // Sort by date and limit to 5
  },

  // Fetch task summary grouped by status
  getTaskSummary: async (userId: string) => {
    return Task.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  },

  // Fetch overdue tasks and look up their meeting titles
  getOverdueTasks: async (userId: string) => {
    return Task.aggregate([
      {
        $match: {
          userId,
          dueDate: { $lt: new Date() },
          status: { $ne: "completed" },
        },
      },
      {
        $lookup: {
          from: "meetings",
          localField: "meetingId",
          foreignField: "_id",
          as: "meetingInfo",
        },
      },
      { $unwind: "$meetingInfo" },
      {
        $project: {
          _id: 1,
          title: 1,
          dueDate: 1,
          meetingId: 1,
          meetingTitle: "$meetingInfo.title",
        },
      },
    ]);
  },

  // Fetch total meetings count for the user
  getTotalMeetingsCount: async (userId: string) => {
    return db.countDocuments(Meeting, { userId });
  },
};
