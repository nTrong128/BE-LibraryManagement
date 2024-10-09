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
const router = Router();

router.get("/check-auth", authenticateToken, checkAuth);
router.post("/signup", validate(TaiKhoanSchema), signup);
router.post("/logout", logout);
router.post("/login", validate(TaiKhoanSchema.pick({username: true, password: true})), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export {router as AuthRouter};
