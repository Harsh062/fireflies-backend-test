import { dashboardService } from "../../services/dashboardService";
import { dashboardRepo } from "../../repos/dashboardRepo";
import { Types } from "mongoose";

interface UpcomingMeeting {
  _id: Types.ObjectId | string;
  title: string;
  date: Date;
  participants: string[];
  transcript: string;
  summary: string;
  actionItems: string[];
}

jest.mock("../../repos/dashboardRepo");

describe("dashboardService", () => {
  const mockUserId = "user123";

  const mockUpcomingMeetings: UpcomingMeeting[] = [
    {
      _id: "meeting1",
      title: "Upcoming Meeting 1",
      date: new Date("2025-02-01"),
      participants: ["user1", "user2"],
      transcript: "",
      summary: "",
      actionItems: [],
    },
    {
      _id: "meeting2",
      title: "Upcoming Meeting 2",
      date: new Date("2025-02-02"),
      participants: ["user1"],
      transcript: "",
      summary: "",
      actionItems: [],
    },
  ];

  const mockTaskSummary = [
    { _id: "pending", count: 3 },
    { _id: "in-progress", count: 2 },
    { _id: "completed", count: 5 },
  ];

  const mockOverdueTasks = [
    {
      _id: "task1",
      title: "Overdue Task 1",
      dueDate: new Date("2025-01-01"),
      meetingId: "meeting1",
      meetingTitle: "Upcoming Meeting 1",
    },
    {
      _id: "task2",
      title: "Overdue Task 2",
      dueDate: new Date("2025-01-05"),
      meetingId: "meeting2",
      meetingTitle: "Upcoming Meeting 2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return dashboard data for a user", async () => {
    (dashboardRepo.getTotalMeetingsCount as jest.Mock).mockResolvedValue(10);
    (dashboardRepo.getUpcomingMeetings as jest.Mock).mockResolvedValue(
      mockUpcomingMeetings
    );
    (dashboardRepo.getTaskSummary as jest.Mock).mockResolvedValue(
      mockTaskSummary
    );
    (dashboardRepo.getOverdueTasks as jest.Mock).mockResolvedValue(
      mockOverdueTasks
    );

    const result = await dashboardService.getDashboardData(mockUserId);

    expect(result.totalMeetings).toBe(10);
    expect(result.taskSummary).toEqual({
      pending: 3,
      inProgress: 2,
      completed: 5,
    });
    expect(result.upcomingMeetings).toEqual([
      {
        _id: "meeting1",
        title: "Upcoming Meeting 1",
        date: new Date("2025-02-01"),
        participantCount: 2,
      },
      {
        _id: "meeting2",
        title: "Upcoming Meeting 2",
        date: new Date("2025-02-02"),
        participantCount: 1,
      },
    ]);
    expect(result.overdueTasks).toEqual(mockOverdueTasks);

    expect(dashboardRepo.getTotalMeetingsCount).toHaveBeenCalledWith(
      mockUserId
    );
    expect(dashboardRepo.getUpcomingMeetings).toHaveBeenCalledWith(mockUserId);
    expect(dashboardRepo.getTaskSummary).toHaveBeenCalledWith(mockUserId);
    expect(dashboardRepo.getOverdueTasks).toHaveBeenCalledWith(mockUserId);
  });

  it("should handle no data gracefully", async () => {
    (dashboardRepo.getTotalMeetingsCount as jest.Mock).mockResolvedValue(0);
    (dashboardRepo.getUpcomingMeetings as jest.Mock).mockResolvedValue([]);
    (dashboardRepo.getTaskSummary as jest.Mock).mockResolvedValue([]);
    (dashboardRepo.getOverdueTasks as jest.Mock).mockResolvedValue([]);

    const result = await dashboardService.getDashboardData(mockUserId);

    expect(result.totalMeetings).toBe(0);
    expect(result.taskSummary).toEqual({
      pending: 0,
      inProgress: 0,
      completed: 0,
    });
    expect(result.upcomingMeetings).toEqual([]);
    expect(result.overdueTasks).toEqual([]);

    expect(dashboardRepo.getTotalMeetingsCount).toHaveBeenCalledWith(
      mockUserId
    );
    expect(dashboardRepo.getUpcomingMeetings).toHaveBeenCalledWith(mockUserId);
    expect(dashboardRepo.getTaskSummary).toHaveBeenCalledWith(mockUserId);
    expect(dashboardRepo.getOverdueTasks).toHaveBeenCalledWith(mockUserId);
  });
});
