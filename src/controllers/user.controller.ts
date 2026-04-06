import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
