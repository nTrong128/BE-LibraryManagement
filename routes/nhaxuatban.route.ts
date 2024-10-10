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

const router = Router();

router.get("/", getAllNhaXuatBan);
router.get("/:id", getNhaXuatBanById);
router.post(
  "/",
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(NhaXuatBanSchema),
  createNhaXuatBan
);

router.put(
  "/:id",
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(NhaXuatBanSchema.partial()),
  updateNhaXuatBan
); // Partial validate only the fields that are being updated.
router.patch("/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), deleteNhaXuatBan);

export {router as nhaXuatBanRouter};
