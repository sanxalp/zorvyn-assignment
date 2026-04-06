import { Router } from "express";
import { 
  getRecordsHandler, 
  getRecordByIdHandler, 
  createRecordHandler, 
  updateRecordHandler, 
  deleteRecordHandler 
} from "../controllers/record.controller";
import { validate } from "../middleware/validate";
import { createRecordSchema, updateRecordSchema, getRecordsQuerySchema } from "../schema/record.schema";
import { requireAuth, requireRoles } from "../middleware/auth";

const router = Router();

// Protect all record routes
router.use(requireAuth);

// ANALYST and ADMIN can view records
router.get("/", requireRoles(["ANALYST", "ADMIN"]), validate(getRecordsQuerySchema), getRecordsHandler);
router.get("/:id", requireRoles(["ANALYST", "ADMIN"]), getRecordByIdHandler);

// Only ADMIN can mutate records
router.post("/", requireRoles(["ADMIN"]), validate(createRecordSchema), createRecordHandler);
router.put("/:id", requireRoles(["ADMIN"]), validate(updateRecordSchema), updateRecordHandler);
router.delete("/:id", requireRoles(["ADMIN"]), deleteRecordHandler);

export default router;
