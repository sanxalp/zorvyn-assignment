import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    details = err.errors.map((e) => ({ path: e.path.join("."), message: e.message }));
  } else if (err.code === 'P2002') { // Prisma unique constraint violation
    statusCode = 409;
    message = "Unique Constraint Violation";
    details = err.meta?.target;
  } else {
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details && { details }),
    },
  });
};
