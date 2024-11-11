import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {sendResponse} from "../utils/response";
import {AuthenticatedRequest} from "../utils/authenticateRequest";
import {TokenExpiredError} from "jsonwebtoken";

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return sendResponse(res, 401, "Unauthorized - No token provided");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

    if (!decoded) return sendResponse(res, 401, "Unauthorized - Invalid token");

    req.userId = (decoded as jwt.JwtPayload).id;
    req.role = (decoded as jwt.JwtPayload).role;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendResponse(res, 401, "Unauthorized - Token expired");
    }

    console.log("error in authMiddleware");
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};
