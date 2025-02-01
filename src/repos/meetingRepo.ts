import NodeCache from "node-cache";
import { IMeeting, Meeting } from "../models/meeting";
import { Task } from "../models/task";
import { db } from "./db";

// Initialize cache with a 5-minute TTL (Time To Live)
const cache = new NodeCache({ stdTTL: 300 });

export const meetingRepo = {
  // Find a meeting by ID and user (ensuring ownership)
  findMeetingByIdAndUser: async (meetingId: string, userId: string) => {
    return db.findOne(Meeting, { _id: meetingId, userId });
  },

  // Fetch paginated meetings for a user, sorted by date
  findMeetings: async (userId: string, page: number, limit: number) => {
    return db.find(Meeting, { userId }, { page, limit }, { date: -1 });
  },

  // Create a new meeting record
  createMeeting: async (meetingData: any) => {
    return db.create(Meeting, meetingData);
  },

  // Retrieve a meeting by ID
  findMeetingById: async (id: string): Promise<IMeeting | null> => {
    return db.findById(Meeting, id);
  },

  // Update specific fields of a meeting
  updateMeeting: async (id: string, updateData: any) => {
    return db.updateById(Meeting, id, updateData);
  },

  // Retrieve statistics about a user's meetings
  getMeetingStats: async (userId: string) => {
    // Check if cached stats exist to avoid unnecessary database queries
    const cachedStats = cache.get(`meetingStats_${userId}`);
    if (cachedStats) return cachedStats;

    // Aggregate general statistics about meetings
    const generalStats = await Meeting.aggregate([
      { $match: { userId } },
      {
        $facet: {
          totalMeetings: [{ $count: "totalMeetings" }],
          totalParticipants: [
            { $unwind: "$participants" },
            { $group: { _id: null, total: { $sum: 1 } } },
          ],
          averageParticipants: [
            {
              $group: {
                _id: null,
                avgParticipants: { $avg: { $size: "$participants" } },
              },
            },
          ],
          durationStats: [
            {
              $group: {
                _id: null,
                shortestMeeting: { $min: "$duration" },
                longestMeeting: { $max: "$duration" },
                averageDuration: { $avg: "$duration" },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalMeetings: { $arrayElemAt: ["$totalMeetings.totalMeetings", 0] },
          totalParticipants: { $arrayElemAt: ["$totalParticipants.total", 0] },
          averageParticipants: {
            $arrayElemAt: ["$averageParticipants.avgParticipants", 0],
          },
          shortestMeeting: {
            $arrayElemAt: ["$durationStats.shortestMeeting", 0],
          },
          longestMeeting: {
            $arrayElemAt: ["$durationStats.longestMeeting", 0],
          },
          averageDuration: {
            $arrayElemAt: ["$durationStats.averageDuration", 0],
          },
        },
      },
    ]);

    // Identify the top 5 most active participants
    const topParticipants = await Meeting.aggregate([
      { $match: { userId } },
      { $unwind: "$participants" },
      { $group: { _id: "$participants", meetingCount: { $sum: 1 } } },
      { $sort: { meetingCount: -1 } },
      { $limit: 5 },
    ]);

    // Count meetings grouped by the day of the week
    const meetingsByDayOfWeek = await Meeting.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Construct final stats response
    const stats = {
      generalStats: {
        totalMeetings: generalStats[0]?.totalMeetings || 0,
        averageParticipants: generalStats[0]?.averageParticipants || 0,
        totalParticipants: generalStats[0]?.totalParticipants || 0,
        shortestMeeting: generalStats[0]?.shortestMeeting || 0,
        longestMeeting: generalStats[0]?.longestMeeting || 0,
        averageDuration: generalStats[0]?.averageDuration || 0,
      },
      topParticipants: topParticipants.map((participant: any) => ({
        participant: participant._id,
        meetingCount: participant.meetingCount,
      })),
      meetingsByDayOfWeek: Array.from({ length: 7 }, (_, index) => {
        const dayStats =
          meetingsByDayOfWeek.find((d: any) => d._id === index + 1) || {};
        return { dayOfWeek: index + 1, count: dayStats.count || 0 };
      }),
    };

    // Store the stats in cache to reduce load on the database
    cache.set(`meetingStats_${userId}`, stats, 300); // Cache for 5 minutes

    return stats;
  },

  // Update a meeting with AI-generated summary, action items, and category
  updateMeetingSummaryAndActionItems: async (
    meetingId: string,
    summary: string,
    actionItems: string[],
    category: string
  ) => {
    return Meeting.bulkWrite([
      {
        updateOne: {
          filter: { _id: meetingId },
          update: { $set: { summary, actionItems, category } },
        },
      },
    ]);
  },

  // Create tasks linked to a specific meeting
  createTasksForMeeting: async (
    meetingId: string,
    tasks: string[],
    userId: string
  ) => {
    const taskDocuments = tasks.map((task) => ({
      title: task,
      dueDate: null, // Can be set dynamically based on business logic
      status: "pending",
      meetingId,
      userId,
    }));
    return db.insertMany(Task, taskDocuments);
  },
};
