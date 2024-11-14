import {sendResponse} from "./../utils/response";
import type {Request, Response, NextFunction} from "express";
import {ZodSchema} from "zod";
export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.error?.errors[0].code === "unrecognized_keys") {
      return sendResponse(res, 400, "Truyền thừa trường không cần thiết");
    }
    if (!result.success) {
      next(result.error);
    }
    next();
  };
