import { Request, Response, NextFunction } from "express";
import * as recordService from "../services/record.service";

export const getRecordsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await recordService.getRecords(req.query as any);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getRecordByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const createRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is guaranteed to be set by the auth middleware
    const record = await recordService.createRecord(req.user!.id, req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const updateRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteRecordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
