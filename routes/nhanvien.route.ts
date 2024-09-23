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

const router = Router();

router.get("/", getAllNhanVien);
router.get("/:id", getNhanVienById);
router.post("/", validate(NhanVienSchema), createNhanVien);

router.put("/:id", validate(NhanVienSchema.partial()), updateNhanVien); // Partial validate only the fields that are being updated.
router.patch("/:id", deleteNhanVien);

export {router as nhanVienRouter};
