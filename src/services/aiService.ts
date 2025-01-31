export const aiService = {
  generateSummaryAndActionItems: async (
    transcript: string
  ): Promise<AiSummaryResult> => {
    // Mock AI response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: `Summary of the meeting based on the transcript: "${transcript}"`,
          actionItems: [
            "Follow up with John on project status",
            "Prepare the presentation for the next client meeting",
            "Send meeting notes to all participants",
          ],
        });
      }, 1000); // Simulate async response
    });
  },
};

export interface AiSummaryResult {
  summary: string;
  actionItems: string[];
}
