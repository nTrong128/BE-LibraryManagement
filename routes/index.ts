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

router.get("/nhanvien", getAllNhanVien);
router.get("/nhanvien/:id", getNhanVienById);
router.post("/nhanvien", validate(NhanVienSchema), createNhanVien);
router.put("/nhanvien/:id", updateNhanVien);
router.delete("/nhanvien/:id", deleteNhanVien);

export {router};
