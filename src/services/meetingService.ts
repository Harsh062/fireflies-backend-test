import { IMeeting } from "../models/meeting";
import { meetingRepo } from "../repos/meetingRepo";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";
import { aiService } from "./aiService";

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

  summarizeMeeting: async (meetingId: string, userId: string) => {
    const meeting = await meetingRepo.findMeetingById(meetingId);

    if (!meeting) {
      throw new NotFoundError("Meeting not found");
    }

    if (meeting.userId !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to summarize this meeting"
      );
    }

    const transcript = meeting.transcript?.trim();
    if (!transcript) {
      throw new ValidationError("Transcript is missing or empty");
    }

    // Call the AI service to generate summary and action items
    const { summary, actionItems } =
      await aiService.generateSummaryAndActionItems(transcript);

    await meetingRepo.updateMeetingSummaryAndActionItems(
      meetingId,
      summary,
      actionItems
    );

    // Create tasks for the action items
    await meetingRepo.createTasksForMeeting(meetingId, actionItems, userId);

    return { summary, actionItems };
  },
};
