import bcrypt from "bcrypt";
import {Request, Response, NextFunction} from "express";
import * as TaiKhoanService from "../services/TaiKhoan.service";
import * as DocGiaService from "../services/DocGia.service";
import * as NhanVienService from "../services/NhanVien.service";
import {Role, TaiKhoan} from "@prisma/client";
import {generateTokenAndSetCookies} from "../utils/tokenAndCookies";
import {sendResponse} from "../utils/response";
import crypto from "crypto";
import {sendResetPasswordEmail, sendResetPasswordSuccessEmail} from "../utils/sendEmail";
import {AuthenticatedRequest} from "../utils/authenticateRequest";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const user: Omit<TaiKhoan, "id" | "createAt" | "updateAt" | "deleted"> & {
    HoTen: string;
    DiaChi: string;
    SoDienThoai: string;
    ChucVu?: string;
  } = req.body;
  try {
    const existAccount = await TaiKhoanService.getTaiKhoanByUserNameOrEmail(
      user.username,
      user.email
    );
    if (existAccount) {
      return sendResponse(res, 400, "Tài khoản hoặc mật khẩu đã tồn tại");
    }

    const newUser = await DocGiaService.createDocgia({
      HoTen: user.HoTen,
      DiaChi: user.DiaChi,
      SoDienThoai: user.SoDienThoai,
    });

    const newAccount = await TaiKhoanService.createTaiKhoan({
      username: user.username,
      password: user.password,
      email: user.email,
      role: Role.DOCGIA,
      nhanVienId: null,
      docGiaId: newUser.MaDocGia,
    });

    //jwt
    generateTokenAndSetCookies(res, newAccount);

    const {password, nhanVienId, ...noPasswordUser} = newAccount;

    sendResponse(res, 201, "Đăng ký tài khoản thành công", noPasswordUser);
  } catch (error) {
    next(error);
  }
};

export const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
  const user: Omit<TaiKhoan, "id" | "createAt" | "updateAt" | "deleted"> & {
    HoTenNV: string;
    DiaChi: string;
    SoDienThoai: string;
    ChucVu: string;
  } = req.body;
  try {
    const existAccount = await TaiKhoanService.getTaiKhoanByUserNameOrEmail(
      user.username,
      user.email
    );
    if (existAccount) {
      return sendResponse(res, 400, "Tài khoản hoặc mật khẩu đã tồn tại");
    }

    const newUser = await NhanVienService.createNhanVien({
      HoTenNV: user.HoTenNV,
      DiaChi: user.DiaChi,
      SoDienThoai: user.SoDienThoai,
      ChucVu: user.ChucVu,
    });

    const newAccount = await TaiKhoanService.createTaiKhoan({
      username: user.username,
      password: user.password,
      email: user.email,
      role: Role.NHANVIEN,
      nhanVienId: newUser.MSNV,
      docGiaId: null,
    });

    const {password, nhanVienId, ...noPasswordUser} = newAccount;

    sendResponse(res, 201, "Tạo tài khoản nhân viên thành công", noPasswordUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body;
  try {
    const user = await TaiKhoanService.login(username, password);
    if (!user) {
      return sendResponse(res, 400, "Tài khoản hoặc mật khẩu không đúng");
    }

    //   jwt
    generateTokenAndSetCookies(res, user);
    sendResponse(res, 200, "Đăng nhập thành công", {...user, password: undefined});
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token");
  sendResponse(res, 200, "Đăng xuất thành công");
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body;
  try {
    const user = await TaiKhoanService.getTaiKhoanByEmail(email);
    if (!user) {
      return sendResponse(res, 404, " Email không tồn tại");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiesAt = Date.now() + 1000 * 60 * 10; // 10 minutes
    await TaiKhoanService.updateTaiKhoanById(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: new Date(resetTokenExpiesAt),
    });

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    sendResponse(res, 200, "Reset password email sent");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token;
    const {password} = req.body;
    const user = await TaiKhoanService.getTaiKhoanByResetToken(token);
    if (!user) {
      return sendResponse(res, 400, "Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await TaiKhoanService.updateTaiKhoanById(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    });
    await sendResetPasswordSuccessEmail(user.email);
    sendResponse(res, 200, "Password reset successfully");
  } catch {}
};

export const checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 400, "Invalid user ID");
    }

    const user = await TaiKhoanService.getTaiKhoanById(req.userId);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }
    const {password, ...noPasswordUser} = user;
    sendResponse(res, 200, "Authenticated", noPasswordUser);
  } catch (error) {
    next(error);
  }
};
