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

router.post("/", validate(SachSchema), createSach);

router.put("/:id", validate(SachSchema.partial()), updateSach);
router.patch("/:id", deleteSach);

export {router as SachRouter};
