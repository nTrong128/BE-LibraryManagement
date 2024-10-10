import {Router} from "express";
import {
  getAllDocGia,
  getDocGiaById,
  createDocGia,
  updateDocgia,
  deleteDocGia,
} from "../controllers/DocGia.controller";
import {validate} from "../middlewares/validate";
import {DocGiaSchema} from "../schemas/docgia";
import {checkRole} from "../utils/roleCheck";
import {Role} from "@prisma/client";

const router = Router();

router.get("/", checkRole([Role.ADMIN, Role.NHANVIEN]), getAllDocGia);
router.get("/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), getDocGiaById);
router.post("/", checkRole([Role.ADMIN, Role.NHANVIEN]), validate(DocGiaSchema), createDocGia);

router.put(
  "/:id",
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(DocGiaSchema.partial()),
  updateDocgia
); // Partial validate only the fields that are being updated.
router.patch("/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), deleteDocGia);

export {router as docGiaRouter};
