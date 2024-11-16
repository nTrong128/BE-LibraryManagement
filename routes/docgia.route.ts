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
import {authenticateToken} from "../middlewares/authMiddleware";

const router = Router();

// router.get("/", authenticateToken, checkRole([Role.ADMIN, Role.NHANVIEN]), getAllDocGia);
router.get("/", getAllDocGia);

router.get("/:id", getDocGiaById);
router.post("/", checkRole([Role.ADMIN, Role.NHANVIEN]), validate(DocGiaSchema), createDocGia);

router.put(
  "/:id",
  authenticateToken,
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(DocGiaSchema.partial()),
  updateDocgia
); // Partial validate only the fields that are being updated.
router.patch("/:id", authenticateToken, checkRole([Role.ADMIN, Role.NHANVIEN]), deleteDocGia);

export {router as docGiaRouter};
