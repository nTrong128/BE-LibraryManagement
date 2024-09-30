import {Router} from "express";
import {nhanVienRouter} from "./nhanvien.route";
import {nhaXuatBanRouter} from "./nhaxuatban.route";
import {docGiaRouter} from "./docgia.route";
import {SachRouter} from "./sach.route";

const router = Router();

router.use("/nhanvien", nhanVienRouter);
router.use("/nhaxuatban", nhaXuatBanRouter);
router.use("/docgia", docGiaRouter);
router.use("/sach", SachRouter);

export {router};
