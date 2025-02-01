export const aiService = {
  generateSummaryAndActionItems: async (
    transcript: string
  ): Promise<AiSummaryResult> => {
    // meeting categories and keywords for classification
    const categories = {
      "Stand-up": ["progress update", "yesterday", "today", "blockers"],
      "One-on-One": ["feedback", "career", "mentorship", "personal"],
      "Project Planning": ["deadline", "timeline", "deliverables", "scope"],
      Retrospective: ["review", "lessons learned", "what went well", "improve"],
    };

    let detectedCategory = "General"; // Default category

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((word) => transcript.toLowerCase().includes(word))) {
        detectedCategory = category;
        break;
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: `Summary of the meeting based on the transcript: "${transcript}"`,
          actionItems: [
            "Follow up with John on project status",
            "Prepare the presentation for the next client meeting",
            "Send meeting notes to all participants",
          ],
          category: detectedCategory,
        });
      }, 1000); // Simulating async response
    });
  },
};

export interface AiSummaryResult {
  summary: string;
  actionItems: string[];
  category: string;
}
