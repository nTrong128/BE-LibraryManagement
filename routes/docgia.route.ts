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

const router = Router();

router.get("/", getAllDocGia);
router.get("/:id", getDocGiaById);
router.post("/", validate(DocGiaSchema), createDocGia);

router.put("/:id", validate(DocGiaSchema.partial()), updateDocgia); // Partial validate only the fields that are being updated.
router.patch("/:id", deleteDocGia);

export {router as docGiaRouter};
