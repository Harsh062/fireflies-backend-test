import { Response } from "express";
import { dashboardService } from "../services/dashboardService";
import { AuthenticatedRequest } from "../middlewares/auth";

export const dashboardController = {
  getDashboard: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const dashboardData = await dashboardService.getDashboardData(userId);
      res.status(200).json(dashboardData);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  },
};
