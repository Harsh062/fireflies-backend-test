import { IMeeting } from "../models/meeting";
import { meetingRepo } from "../repos/meetingRepo";

export const meetingService = {
  getAllMeetings: async (userId: string, page: number, limit: number) => {
    return meetingRepo.findMeetings(userId, page, limit);
  },

  createMeeting: async (meetingData: any) => {
    return meetingRepo.createMeeting(meetingData);
  },

  getMeetingById: async (id: string): Promise<IMeeting | null> => {
    return meetingRepo.findMeetingById(id);
  },

  updateTranscript: async (id: string, transcript: string) => {
    return meetingRepo.updateMeeting(id, { transcript });
  },

  getStats: async () => {
    return {
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
  },
};
