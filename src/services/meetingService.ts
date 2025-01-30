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

  getMeetingStats: async () => {
    return meetingRepo.getMeetingStats();
  },
};
