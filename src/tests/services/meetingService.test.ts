// Unit tests for MeetingService
import { meetingService } from "../../services/meetingService";
import { meetingRepo } from "../../repos/meetingRepo";
import { aiService } from "../../services/aiService";
import { IMeeting } from "../../models/meeting";

jest.mock("../../repos/meetingRepo");
jest.mock("../../services/aiService");

const mockMeetingRepo = meetingRepo as jest.Mocked<typeof meetingRepo>;
const mockAiService = aiService as jest.Mocked<typeof aiService>;

describe("MeetingService", () => {
  const sampleMeeting: any = {
    _id: "123",
    userId: "user1",
    title: "Test Meeting",
    date: new Date(),
    participants: ["Alice", "Bob"],
    transcript: "This is a sample transcript.",
    summary: "",
    actionItems: [],
    duration: 60,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMeetingById", () => {
    it("should return a meeting if it exists", async () => {
      mockMeetingRepo.findMeetingById.mockResolvedValue(sampleMeeting);

      const result = await meetingService.getMeetingById("123");

      expect(mockMeetingRepo.findMeetingById).toHaveBeenCalledWith("123");
      expect(result).toEqual(sampleMeeting);
    });

    it("should return null if the meeting does not exist", async () => {
      // Mock the repository to return null
      mockMeetingRepo.findMeetingById.mockResolvedValue(null);

      // Call the service method
      const result = await meetingService.getMeetingById("123");

      // Assert that the result is null
      expect(result).toBeNull();
    });
  });

  describe("summarizeMeeting", () => {
    it("should generate and save summary and action items for a meeting", async () => {
      const mockSummary = "This is a summary.";
      const mockActionItems = ["Action Item 1", "Action Item 2"];

      mockMeetingRepo.findMeetingById.mockResolvedValue(sampleMeeting);
      mockAiService.generateSummaryAndActionItems.mockResolvedValue({
        summary: mockSummary,
        actionItems: mockActionItems,
      });

      await meetingService.summarizeMeeting("123", "user1");

      expect(mockMeetingRepo.findMeetingById).toHaveBeenCalledWith("123");
      expect(mockAiService.generateSummaryAndActionItems).toHaveBeenCalledWith(
        sampleMeeting.transcript
      );
      expect(
        mockMeetingRepo.updateMeetingSummaryAndActionItems
      ).toHaveBeenCalledWith("123", mockSummary, mockActionItems);
    });

    it("should throw an error if the meeting does not exist", async () => {
      mockMeetingRepo.findMeetingById.mockResolvedValue(null);

      await expect(
        meetingService.summarizeMeeting("123", "user1")
      ).rejects.toThrow("Meeting not found");
    });

    it("should throw an error if the transcript is empty", async () => {
      const meetingWithoutTranscript = { ...sampleMeeting, transcript: "" };
      mockMeetingRepo.findMeetingById.mockResolvedValue(
        meetingWithoutTranscript
      );

      await expect(
        meetingService.summarizeMeeting("123", "user1")
      ).rejects.toThrow("Transcript is missing or empty");
    });

    it("should throw an error if the user is not authorized", async () => {
      const meetingWithDifferentUser = { ...sampleMeeting, userId: "user2" };
      mockMeetingRepo.findMeetingById.mockResolvedValue(
        meetingWithDifferentUser
      );

      await expect(
        meetingService.summarizeMeeting("123", "user1")
      ).rejects.toThrow("You are not authorized to summarize this meeting");
    });
  });
});
