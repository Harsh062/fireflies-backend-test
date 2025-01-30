import { dashboardRepo } from "../repos/dashboardRepo";

export const dashboardService = {
  getDashboardData: async (userId: string) => {
    // Fetch data from repositories
    const [totalMeetings, upcomingMeetings, taskSummary, overdueTasks] =
      await Promise.all([
        dashboardRepo.getTotalMeetingsCount(userId),
        dashboardRepo.getUpcomingMeetings(userId),
        dashboardRepo.getTaskSummary(userId),
        dashboardRepo.getOverdueTasks(userId),
      ]);

    // Format task summary
    const taskSummaryFormatted = {
      pending: taskSummary.find((s) => s._id === "pending")?.count || 0,
      inProgress: taskSummary.find((s) => s._id === "in-progress")?.count || 0,
      completed: taskSummary.find((s) => s._id === "completed")?.count || 0,
    };

    // Format upcoming meetings with participant count
    const formattedUpcomingMeetings = upcomingMeetings.map((meeting) => ({
      _id: meeting._id,
      title: meeting.title,
      date: meeting.date,
      participantCount: meeting.participants.length,
    }));

    return {
      totalMeetings,
      taskSummary: taskSummaryFormatted,
      upcomingMeetings: formattedUpcomingMeetings,
      overdueTasks,
    };
  },
};
