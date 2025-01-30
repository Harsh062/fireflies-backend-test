import { IMeeting, Meeting } from "../models/meeting";
import { db } from "./db";

export const meetingRepo = {
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
};
