import {Router} from "express";
import {nhanVienRouter} from "./nhanvien.route";
import {nhaXuatBanRouter} from "./nhaxuatban.route";

const router = Router();

router.use("/nhanvien", nhanVienRouter);
router.use("/nhaxuatban", nhaXuatBanRouter);

export {router};
