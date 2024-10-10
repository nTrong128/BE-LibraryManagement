import {Router} from "express";
import {
  createMuonSach,
  deleteMuonSach,
  getAllMuonSach,
  getMuonSachhById,
  getMuonSachhByDocGiaId,
  updateMuonSach,
  getMuonSachhBySachId,
} from "../controllers/MuonSach.controller";
import {validate} from "../middlewares/validate";
import {MuonSachSchema} from "../schemas/muonsach";
import {checkRole} from "../utils/roleCheck";
import {Role} from "@prisma/client";

const router = Router();

router.get("/", checkRole([Role.ADMIN, Role.NHANVIEN]), getAllMuonSach);
router.get("/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), getMuonSachhById);
router.get("/docgia/:id", getMuonSachhByDocGiaId);
router.get("/sach/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), getMuonSachhBySachId);

router.post(
  "/",
  checkRole([Role.DOCGIA, Role.ADMIN, Role.NHANVIEN]),
  validate(MuonSachSchema),
  createMuonSach
);

router.put(
  "/:id",
  checkRole([Role.ADMIN, Role.DOCGIA, Role.NHANVIEN]),
  validate(MuonSachSchema.partial()),
  updateMuonSach
);
router.patch("/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), deleteMuonSach);

export {router as MuonSachRouter};
