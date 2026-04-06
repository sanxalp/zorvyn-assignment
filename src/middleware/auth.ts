import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export type Role = "VIEWER" | "ANALYST" | "ADMIN";

// Extend Request interface to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}    

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authentication token is missing"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: Role };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

export const requireRoles = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Requires one of roles: ${roles.join(", ")}`));
    }
    next();
  };
};
