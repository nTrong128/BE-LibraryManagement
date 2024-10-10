import {Router} from "express";
import {
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/Auth.controller";
import {validate} from "../middlewares/validate";
import {TaiKhoanSchema} from "../schemas/taikhoan";
import {authenticateToken} from "../middlewares/authMiddleware";
import {checkRole} from "../utils/roleCheck";

import {Role} from "@prisma/client";

const router = Router();

// Verify user after each refresh in frontend to keep user logged in
router.get("/check-auth", authenticateToken, checkAuth);

// Tạo một tài khoản nhân viên thư viện
router.post("/admin-signup", checkRole([Role.ADMIN]), validate(TaiKhoanSchema), signup);
// Tạo một tài khoản người dùng
router.post("/signup", validate(TaiKhoanSchema), signup);

router.post("/logout", logout);
router.post("/login", validate(TaiKhoanSchema.pick({username: true, password: true})), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export {router as AuthRouter};
