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

const router = Router();

router.get("/", getAllMuonSach);
router.get("/:id", getMuonSachhById);
router.get("/docgia/:id", getMuonSachhByDocGiaId);
router.get("/sach/:id", getMuonSachhBySachId);

router.post("/", validate(MuonSachSchema), createMuonSach);

router.put("/:id", validate(MuonSachSchema.partial()), updateMuonSach); // Partial validate only the fields that are being updated.
router.patch("/:id", deleteMuonSach);

export {router as MuonSachRouter};
