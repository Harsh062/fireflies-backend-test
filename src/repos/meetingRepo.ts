import { IMeeting, Meeting } from "../models/meeting";
import { Task } from "../models/task";
import { db } from "./db";

export const meetingRepo = {
  findMeetingByIdAndUser: async (meetingId: string, userId: string) => {
    return db.findOne(Meeting, { _id: meetingId, userId });
  },

  findMeetings: async (userId: string, page: number, limit: number) => {
    return db.find(Meeting, { userId }, { page, limit });
  },

  createMeeting: async (meetingData: any) => {
    return db.create(Meeting, meetingData);
  },

  findMeetingById: async (id: string): Promise<IMeeting | null> => {
    return db.findById(Meeting, id);
  },

  updateMeeting: async (id: string, updateData: any) => {
    return db.updateById(Meeting, id, updateData);
  },

  getMeetingStats: async () => {
    const generalStats = await Meeting.aggregate([
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
          totalParticipants: {
            $arrayElemAt: ["$totalParticipants.total", 0],
          },
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

    const topParticipants = await Meeting.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: "$participants", meetingCount: { $sum: 1 } } },
      { $sort: { meetingCount: -1 } },
      { $limit: 5 },
    ]);

    const meetingsByDayOfWeek = await Meeting.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by day of the week (Sunday = 1, Monday = 2, etc.)
    ]);

    return {
      generalStats: {
        totalMeetings: generalStats[0]?.totalMeetings || 0,
        averageParticipants: generalStats[0]?.averageParticipants || 0,
        totalParticipants: generalStats[0]?.totalParticipants || 0,
        shortestMeeting: generalStats[0]?.shortestMeeting || 0,
        longestMeeting: generalStats[0]?.longestMeeting || 0,
        averageDuration: generalStats[0]?.averageDuration || 0,
      },
      topParticipants: topParticipants.map((participant) => ({
        participant: participant._id,
        meetingCount: participant.meetingCount,
      })),
      meetingsByDayOfWeek: Array.from({ length: 7 }, (_, index) => {
        const dayStats =
          meetingsByDayOfWeek.find((d) => d._id === index + 1) || {};
        return { dayOfWeek: index + 1, count: dayStats.count || 0 };
      }),
    };
  },

  // Update meeting summary and action items
  updateMeetingSummaryAndActionItems: async (
    meetingId: string,
    summary: string,
    actionItems: string[],
    category: string
  ) => {
    return db.updateOne(
      Meeting,
      { _id: meetingId },
      { summary, actionItems, category }
    );
  },

  // Create tasks for a meeting
  createTasksForMeeting: async (
    meetingId: string,
    tasks: string[],
    userId: string
  ) => {
    const taskDocuments = tasks.map((task) => ({
      title: task,
      dueDate: null, // Set due dates as required
      status: "pending",
      meetingId,
      userId,
    }));
    return db.insertMany(Task, taskDocuments);
  },
};
