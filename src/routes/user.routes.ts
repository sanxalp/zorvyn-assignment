import { Router } from "express";
import { getAllUsersHandler, createUserHandler, updateUserRoleHandler } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserRoleSchema } from "../schema/user.schema";
import { requireAuth, requireRoles } from "../middleware/auth";

const router = Router();

// Only ADMIN can access user management routes
router.use(requireAuth, requireRoles(["ADMIN"]));

router.get("/", getAllUsersHandler);
router.post("/", validate(createUserSchema), createUserHandler);
router.put("/:id/role", validate(updateUserRoleSchema), updateUserRoleHandler);

export default router;
