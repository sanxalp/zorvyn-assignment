import { z } from "zod";

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().datetime("Invalid ISO date format"),
    notes: z.string().optional(),
  }),
});

export const updateRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});

export const getRecordsQuerySchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>["body"];
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>["body"];
export type GetRecordsQueryInput = z.infer<typeof getRecordsQuerySchema>["query"];
