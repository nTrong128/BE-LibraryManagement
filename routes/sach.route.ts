import {Router} from "express";
import {
  createSach,
  deleteSach,
  getAllSach,
  getSachById,
  updateSach,
} from "../controllers/Sach.controller";
import {validate} from "../middlewares/validate";
import {SachSchema} from "../schemas/sach";
import {checkRole} from "../utils/roleCheck";
import {Role} from "@prisma/client";
const router = Router();

router.get("/", getAllSach);
router.get("/:id", getSachById);
router.post("/", checkRole([Role.ADMIN, Role.NHANVIEN]), validate(SachSchema), createSach);

router.put(
  "/:id",
  checkRole([Role.ADMIN, Role.NHANVIEN]),
  validate(SachSchema.partial()),
  updateSach
); // Partial validate only the fields that are being updated.
router.patch("/:id", checkRole([Role.ADMIN, Role.NHANVIEN]), deleteSach);

export {router as SachRouter};
