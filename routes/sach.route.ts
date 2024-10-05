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

const router = Router();

router.get("/", getAllSach);
router.get("/:id", getSachById);
router.post("/", validate(SachSchema), createSach);

router.put("/:id", validate(SachSchema.partial()), updateSach); // Partial validate only the fields that are being updated.
router.patch("/:id", deleteSach);

export {router as SachRouter};
