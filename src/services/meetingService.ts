import { IMeeting } from "../models/meeting";
import { meetingRepo } from "../repos/meetingRepo";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";
import { aiService } from "./aiService";

export const meetingService = {
  // Fetch paginated meetings for a specific user
  getAllMeetings: async (userId: string, page: number, limit: number) => {
    return meetingRepo.findMeetings(userId, page, limit);
  },

  // Create a new meeting record
  createMeeting: async (meetingData: IMeeting) => {
    return meetingRepo.createMeeting(meetingData);
  },

  // Retrieve a meeting by its ID
  getMeetingById: async (id: string): Promise<IMeeting | null> => {
    return meetingRepo.findMeetingById(id);
  },

  // Update the transcript of a meeting
  updateTranscript: async (id: string, transcript: string) => {
    return meetingRepo.updateMeeting(id, { transcript });
  },

  // Get meeting statistics for a user
  getMeetingStats: async (userId: string) => {
    return meetingRepo.getMeetingStats(userId);
  },

  // Process transcript using AI to generate insights
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

    // Call the AI service to generate summary, action items and category
    const { summary, actionItems, category } =
      await aiService.generateSummaryAndActionItems(transcript);

    await meetingRepo.updateMeetingSummaryAndActionItems(
      meetingId,
      summary,
      actionItems,
      category
    );

    // Create tasks for the action items
    await meetingRepo.createTasksForMeeting(meetingId, actionItems, userId);

    return { summary, actionItems, category };
  },
};
