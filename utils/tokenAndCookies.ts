import {Response} from "express";
import jwt from "jsonwebtoken";
import {TaiKhoan} from "@prisma/client";
import {sendResponse} from "./response";

export const generateTokenAndSetCookies = (res: Response, user: TaiKhoan) => {
  const secret = process.env.SECRET_KEY as string;
  if (!secret) {
    sendResponse(res, 500, "NO JWT SECRET FOUND");
  }

  const token = jwt.sign({id: user.id, role: user.role}, secret, {
    expiresIn: "7h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 60 * 60 * 1000,
  });

  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

function generateResetToken(id: string): string {
  const secret = process.env.SECRET_KEY as string;

  return jwt.sign({id}, secret, {expiresIn: "10m"}); // Expires in 10 minutes
}