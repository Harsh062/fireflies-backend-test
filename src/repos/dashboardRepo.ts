import { Meeting } from "../models/meeting";
import { Task } from "../models/task";
import { db } from "./db";

export const dashboardRepo = {
  // Retrieve the next 5 upcoming meetings for a user
  getUpcomingMeetings: async (userId: string) => {
    return db
      .findWithProjection(
        Meeting,
        {
          userId,
          date: { $gte: new Date() }, // Filter for future meetings only
        },
        {
          _id: 1,
          title: 1,
          date: 1,
          participants: 1, // Included to calculate participant count
        }
      )
      .sort({ date: 1 }) // Sort in ascending order (earliest first)
      .limit(5); // Return a maximum of 5 meetings
  },

  // Aggregate and count tasks by status (e.g., pending, completed)
  getTaskSummary: async (userId: string) => {
    return Task.aggregate([
      { $match: { userId } }, // Filter tasks by user
      { $group: { _id: "$status", count: { $sum: 1 } } }, // Group by status and count occurrences
    ]);
  },

  // Retrieve overdue tasks along with the corresponding meeting titles
  getOverdueTasks: async (userId: string) => {
    return Task.aggregate([
      {
        $match: {
          userId,
          dueDate: { $lt: new Date() }, // Only overdue tasks
          status: { $ne: "completed" }, // Exclude completed tasks
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
      { $unwind: "$meetingInfo" }, // Flatten the meeting details array
      {
        $project: {
          _id: 1,
          title: 1,
          dueDate: 1,
          meetingId: 1,
          meetingTitle: "$meetingInfo.title", // Extract meeting title
        },
      },
    ]);
  },

  // Get the total count of meetings for a user
  getTotalMeetingsCount: async (userId: string) => {
    return db.countDocuments(Meeting, { userId });
  },
};
