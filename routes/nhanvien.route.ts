import {Router} from "express";
import {
  createNhanVien,
  getNhanVienById,
  updateNhanVien,
  deleteNhanVien,
  getAllNhanVien,
} from "../controllers/NhanVien.controller";
import {validate} from "../middlewares/validate";
import {NhanVienSchema} from "../schemas/nhanvien";
import {checkRole} from "../utils/roleCheck";
import {Role} from "@prisma/client";
import {authenticateToken} from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, checkRole([Role.ADMIN]), getAllNhanVien);

router.get("/:id", authenticateToken, getNhanVienById);

router.post(
  "/",
  authenticateToken,
  checkRole([Role.ADMIN]),
  validate(NhanVienSchema),
  createNhanVien
);

router.put(
  "/:id",
  authenticateToken,
  checkRole([Role.ADMIN]),
  validate(NhanVienSchema.partial()),
  updateNhanVien
); // Partial validate only the fields that are being updated.

router.patch("/:id", authenticateToken, checkRole([Role.ADMIN]), deleteNhanVien);

export {router as nhanVienRouter};
