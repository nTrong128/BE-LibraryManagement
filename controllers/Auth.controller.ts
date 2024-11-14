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
import {isValidObjectId} from "../utils/validObject";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

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

    const newAccount = await TaiKhoanService.createTaiKhoan({
      username: user.username,
      password: user.password,
      email: user.email,
      role: Role.DOCGIA,
    });

    const newUser = await DocGiaService.createDocgia({
      HoTen: user.HoTen,
      DiaChi: user.DiaChi,
      SoDienThoai: user.SoDienThoai,
      taiKhoanId: newAccount.id,
    });

    //jwt
    generateTokenAndSetCookies(res, newAccount);

    const {password, ...noPasswordUser} = newAccount;

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

    const newAccount = await TaiKhoanService.createTaiKhoan({
      username: user.username,
      password: user.password,
      email: user.email,
      role: Role.NHANVIEN,
    });

    const newUser = await NhanVienService.createNhanVien({
      HoTenNV: user.HoTenNV,
      DiaChi: user.DiaChi,
      SoDienThoai: user.SoDienThoai,
      ChucVu: user.ChucVu,
      taiKhoanId: newAccount.id,
    });

    const {password, ...noPasswordUser} = newAccount;

    sendResponse(res, 201, "Tạo tài khoản nhân viên thành công", {...noPasswordUser, ...newUser});
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

// Update Account (excluding password)
export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "ID tài khoản không hợp lệ");
  }

  try {
    const accountData: Partial<TaiKhoan> = req.body;
    const ChucVu = req.body.ChucVu;

    const updatedAccount: TaiKhoan | null = await TaiKhoanService.updateTaiKhoanById(
      id,
      accountData
    );

    if (!updatedAccount) {
      return sendResponse(res, 404, "Không tìm thấy tài khoản");
    }

    const {password, ...noPasswordAccount} = updatedAccount;

    return sendResponse(res, 200, "Cập nhật tài khoản thành công", noPasswordAccount);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "Không tìm thấy tài khoản");
    }
    next(error);
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "ID tài khoản không hợp lệ");
  }

  try {
    const {currentPassword, newPassword, rePassword} = req.body;

    // Validate new password and re-password
    if (newPassword !== rePassword) {
      return sendResponse(res, 400, "Mật khẩu mới và xác nhận mật khẩu không khớp");
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return sendResponse(res, 400, "Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    // Fetch the account to check the current password
    const account: TaiKhoan | null = await TaiKhoanService.getTaiKhoanById(id);
    if (!account) {
      return sendResponse(res, 404, "Không tìm thấy tài khoản");
    }

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, account.password);
    if (!isPasswordValid) {
      return sendResponse(res, 400, "Mật khẩu hiện tại không đúng");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    const updatedAccount: TaiKhoan | null = await TaiKhoanService.updateTaiKhoanById(id, {
      password: hashedPassword,
    });

    if (!updatedAccount) {
      return sendResponse(res, 404, "Không tìm thấy tài khoản");
    }

    return sendResponse(res, 200, "Cập nhật mật khẩu thành công");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "Không tìm thấy tài khoản");
    }
    next(error);
  }
};
