import { Router } from "express";
import { getDashboardSummaryHandler } from "../controllers/dashboard.controller";
import { requireAuth, requireRoles } from "../middleware/auth";

const router = Router();

// VIEWER, ANALYST, and ADMIN can access the dashboard
router.use(requireAuth, requireRoles(["VIEWER", "ANALYST", "ADMIN"]));

router.get("/summary", getDashboardSummaryHandler);

export default router;
