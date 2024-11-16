import {Router} from "express";
import {
  createMuonSach,
  deleteMuonSach,
  getAllMuonSach,
  getMuonSachhById,
  getMuonSachhByDocGiaId,
  updateMuonSach,
  getMuonSachhBySachId,
  adminUpdateMuonSach,
} from "../controllers/MuonSach.controller";
import {validate} from "../middlewares/validate";
import {MuonSachSchema} from "../schemas/muonsach";
import {checkRole} from "../utils/roleCheck";
import {Role} from "@prisma/client";
import {authenticateToken} from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAllMuonSach);
router.get("/:id", getMuonSachhById);
router.get("/docgia/:id", getMuonSachhByDocGiaId);
router.get("/sach/:id", getMuonSachhBySachId);

router.post("/", validate(MuonSachSchema), createMuonSach);

router.patch(
  "/:id/status",
  authenticateToken,
  validate(MuonSachSchema.partial()),
  adminUpdateMuonSach
);
router.patch("/:id", validate(MuonSachSchema.partial()), updateMuonSach);
router.delete("/:id", deleteMuonSach);

export {router as MuonSachRouter};
