import {Router} from "express";
import {
  createNhaXuatBan,
  deleteNhaXuatBan,
  getAllNhaXuatBan,
  getNhaXuatBanById,
  updateNhaXuatBan,
} from "../controllers/NhaXuatBan.controller";
import {validate} from "../middlewares/validate";
import {NhaXuatBanSchema} from "../schemas/nhaxuatban";
import {checkRole} from "../utils/roleCheck";
import {Role} from "@prisma/client";
import {authenticateToken} from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getAllNhaXuatBan);
router.get("/:id", getNhaXuatBanById);
router.post(
  "/",
  authenticateToken,
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(NhaXuatBanSchema),
  createNhaXuatBan
);

router.put(
  "/:id",
  authenticateToken,
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(NhaXuatBanSchema.partial()),
  updateNhaXuatBan
); // Partial validate only the fields that are being updated.
router.patch("/:id", authenticateToken, checkRole([Role.ADMIN, Role.NHANVIEN]), deleteNhaXuatBan);

export {router as nhaXuatBanRouter};
