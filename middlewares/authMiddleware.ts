import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {sendResponse} from "../utils/response";
import {AuthenticatedRequest} from "../utils/authenticateRequest";

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return sendResponse(res, 401, "Unauthorized - No token provided");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

    if (!decoded) return sendResponse(res, 401, "Unauthorized - Invalid token");
    console.log("decoded", decoded);
    req.userId = (decoded as jwt.JwtPayload).id;
    req.role = (decoded as jwt.JwtPayload).role;
    next();
  } catch {
    console.log("error in authMiddleware");
    return sendResponse(res, 500, "Internal server error");
  }
};
