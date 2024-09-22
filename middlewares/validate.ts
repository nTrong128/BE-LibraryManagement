import type {Request, Response, NextFunction} from "express";
import {ZodSchema} from "zod";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
    }
    next();
  };
