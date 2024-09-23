import {Router} from "express";
import {
  createNhaXuatBan,
  deleteNhaXuatBan,
  getAllNhaXuatBan,
  getNhaXuatBanById,
  updateNhaXuatBan,
} from "../controllers/NhaXuatBan.controller";
import {validate} from "../middlewares/validate";
import {NhaXuatBanSchema} from "../schemas/nhaxuatban";

const router = Router();

router.get("/", getAllNhaXuatBan);
router.get("/:id", getNhaXuatBanById);
router.post("/", validate(NhaXuatBanSchema), createNhaXuatBan);

router.put("/:id", validate(NhaXuatBanSchema.partial()), updateNhaXuatBan); // Partial validate only the fields that are being updated.
router.patch("/:id", deleteNhaXuatBan);

export {router as nhaXuatBanRouter};
