import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>["body"];
