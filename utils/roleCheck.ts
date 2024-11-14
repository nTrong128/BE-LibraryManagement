import {Request, Response, NextFunction} from "express";
import {AuthenticatedRequest} from "../utils/authenticateRequest";
import {sendResponse} from "./response";
import {Role} from "@prisma/client";

export const checkRole = (requiredRole: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userId || !req.role || !requiredRole.includes(req.role)) {
      console.log("Role check failed", req.userId, req.role, requiredRole);
      return sendResponse(res, 403, "Forbidden - Bạn không có quyền truy cập tài nguyên này");
    }
    next();
  };
};
