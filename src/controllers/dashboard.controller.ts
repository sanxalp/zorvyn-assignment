import { Request, Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboard.service";

export const getDashboardSummaryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getDashboardSummary();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
