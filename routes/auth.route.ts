import {Router} from "express";
import {
  login,
  logout,
  signup,
  adminSignup,
  forgotPassword,
  resetPassword,
  checkAuth,
  changePassword,
  updateAccount,
} from "../controllers/Auth.controller";
import {validate} from "../middlewares/validate";
import {TaiKhoanSchema, ChangePasswordSchema} from "../schemas/taikhoan";
import {authenticateToken} from "../middlewares/authMiddleware";
import {checkRole} from "../utils/roleCheck";

import {Role} from "@prisma/client";

const router = Router();

// Verify user after each refresh in frontend to keep user logged in
router.get("/check-auth", authenticateToken, checkAuth);

// Tạo một tài khoản nhân viên thư viện

router.post(
  "/admin-signup",
  // authenticateToken,
  // checkRole([Role.ADMIN]),
  validate(TaiKhoanSchema),
  adminSignup
);

router.post(
  "/account",
  // authenticateToken,
  // checkRole([Role.ADMIN]),
  validate(TaiKhoanSchema.partial()),
  adminSignup
);

// Đổi mật khẩu
router.post(
  "/change-password",
  authenticateToken,
  validate(ChangePasswordSchema.strict()),
  changePassword
);

// Cập nhật thông tin tài khoản
router.post(
  "/update-account",
  authenticateToken,
  validate(TaiKhoanSchema.partial()),
  updateAccount
);

// Tạo một tài khoản người dùng
router.post("/signup", validate(TaiKhoanSchema), signup);

router.post("/logout", authenticateToken, logout);

router.post("/login", validate(TaiKhoanSchema.pick({username: true, password: true})), login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export {router as AuthRouter};
