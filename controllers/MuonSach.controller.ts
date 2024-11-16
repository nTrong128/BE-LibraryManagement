import {TaiKhoan} from "./../schemas/taikhoan";
import type {Request, Response, NextFunction} from "express";
import * as MuonSachService from "../services/MuonSach.service";
import * as SachService from "../services/sach.service";
import * as DocGiaService from "../services/DocGia.service";
import {MuonSach} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {createQuerySchema} from "../schemas/query";
import {z} from "zod";
import {AuthenticatedRequest} from "../utils/authenticateRequest";
import {sendRquestReturnBookEmail} from "../utils/sendEmail";

// Get all MuonSach
export const getAllMuonSach = async (req: Request, res: Response, next: NextFunction) => {
  const muonSachFields = z.enum([
    "TenSach",
    "MaMuon",
    "NgayMuon",
    "NgayTra",
    "NgayYeuCau",
    "NgayXacNhan",
    "updateAt",
    "createAt",
    "deleted",
    "status",
  ]);

  const muonSachQuerySchema = createQuerySchema(muonSachFields.options);
  const {success, data, error} = muonSachQuerySchema.safeParse(req.query);

  if (!success) {
    return sendResponse(
      res,
      400,
      "Invalid query string",
      error.issues.map((issue) => issue.message)
    );
  }
  const {page, pageSize, sortBy, sortOrder, search, searchBy} = data;
  try {
    const {itemList, totalItems} = await MuonSachService.getAllMuonSach(
      pageSize,
      page,
      sortBy,
      sortOrder,
      search,
      searchBy
    );

    if (page) {
      const totalPages = Math.ceil(totalItems / pageSize);
      const meta = {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
        sortBy,
        sortOrder,
      };

      return sendResponse(res, 200, `Retrieved paginated MuonSach at page ${page}`, itemList, meta);
    } else {
      return sendResponse(res, 200, "Retrieved all MuonSach", itemList);
    }
  } catch (error) {
    next(error);
  }
};

// Get Sach by ID
export const getMuonSachhById = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }
  try {
    const MuonSach = await MuonSachService.getMuonSachById(id);

    if (!MuonSach) {
      return sendResponse(res, 404, "MuonSach not found");
    }
    sendResponse(res, 200, "Retrieved MuonSach", MuonSach);
  } catch (error) {
    console.error("Error fetching MuonSach:", error);
    next(error);
  }
};

// Get MuonSach by Sach ID

export const getMuonSachhBySachId = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }
  try {
    const MuonSach = await MuonSachService.getMuonSachBySachId(id);

    if (!MuonSach) {
      return sendResponse(res, 404, "MuonSach not found");
    }
    sendResponse(res, 200, "Retrieved MuonSach", MuonSach);
  } catch (error) {
    console.error("Error fetching MuonSach:", error);
    next(error);
  }
};

// Get MuonSach by DocGia ID

export const getMuonSachhByDocGiaId = async (req: Request, res: Response, next: NextFunction) => {
  const muonSachFields = z.enum([
    "TenSach",
    "MaMuon",
    "NgayMuon",
    "NgayTra",
    "NgayYeuCau",
    "NgayXacNhan",
    "updateAt",
    "createAt",
    "deleted",
    "status",
  ]);

  const muonSachQuerySchema = createQuerySchema(muonSachFields.options);
  const {success, data, error} = muonSachQuerySchema.safeParse(req.query);

  if (!success) {
    return sendResponse(
      res,
      400,
      "Invalid query string",
      error.issues.map((issue) => issue.message)
    );
  }
  const {id} = req.params;

  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid DocGia ID");
  }
  const {page, pageSize, sortBy, sortOrder, search, searchBy} = data;

  try {
    const {itemList, totalItems} = await MuonSachService.getMuonSachByDocGiaId(
      id,
      pageSize,
      page,
      sortBy,
      sortOrder,
      search,
      searchBy
    );

    if (page) {
      const totalPages = Math.ceil(totalItems / pageSize);
      const meta = {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
        sortBy,
        sortOrder,
      };

      return sendResponse(res, 200, `Retrieved paginated MuonSach at page ${page}`, itemList, meta);
    } else {
      return sendResponse(res, 200, "Retrieved all MuonSach", itemList);
    }
  } catch (error) {
    next(error);
  }
};

// Create new MuonSach
export const createMuonSach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const MuonSachData: MuonSach = req.body;
    const existMuonSach = await MuonSachService.getMuonSachByDocGiaIdAndSachId(
      MuonSachData.MaDocGia,
      MuonSachData.MaSach
    );
    if (existMuonSach.length > 0) {
      return sendResponse(res, 400, "Đang mượn sách này!!");
    }

    const sach = await SachService.getSachById(MuonSachData.MaSach!);
    if (!sach) {
      return sendResponse(res, 404, "Không tìm thấy sách");
    }

    if (sach.SoQuyen <= 0) {
      return sendResponse(res, 400, "Sách tạm hết");
    }
    if (
      MuonSachData.NgayTra &&
      MuonSachData.NgayMuon &&
      (MuonSachData.NgayTra < MuonSachData.NgayMuon || MuonSachData.NgayTra < new Date())
    ) {
      return sendResponse(res, 400, "Ngày mượn/trả không hợp lệ");
    }

    const newMuonSach = await MuonSachService.createMuonSach(MuonSachData);
    return sendResponse(res, 201, "MuonSach created", newMuonSach);
  } catch (error) {
    next(error);
  }
};

// Update MuonSach by ID
export const updateMuonSach = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }

  try {
    const MuonSachData: Partial<MuonSach> = req.body;
    const updatedSach = await MuonSachService.updateMuonSachById(id, MuonSachData);

    return sendResponse(res, 200, "MuonSach updated", updatedSach);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "MuonSach not found");
    }
    next(error);
  }
};

// Soft delete MuonSach by ID
export const deleteMuonSach = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }

  try {
    const result = await MuonSachService.softDeleteMuonSachById(id);

    if (!result) {
      return sendResponse(res, 404, "MuonSach not found");
    }

    return sendResponse(res, 204);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "MuonSach not found");
    }
    next(error);
  }
};

export const adminUpdateMuonSach = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }
  const MuonSachData: Partial<MuonSach> = req.body;

  try {
    const updatedSach = await MuonSachService.updateMuonSachById(id, MuonSachData);
    if (!updatedSach) {
      return sendResponse(res, 404, "MuonSach not found");
    }

    return sendResponse(res, 200, "MuonSach updated", updatedSach);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "MuonSach not found");
    }
    next(error);
  }
};

export const yeuCauTraSach = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }
  try {
    const muonSach = await MuonSachService.getMuonSachById(id);
    if (!muonSach) {
      return sendResponse(res, 404, "MuonSach not found");
    }
    const {Sach, Docgia, NgayTra, ...rest} = muonSach;

    const docGia = await DocGiaService.getDocgiaById(Docgia.MaDocGia);
    if (!docGia) {
      return sendResponse(res, 404, "DocGia not found");
    }
    console.log(docGia.TaiKhoan!.email, docGia.HoTen, Sach.TenSach, formatDate(NgayTra || ""));

    await sendRquestReturnBookEmail(
      docGia.TaiKhoan!.email,
      docGia.HoTen,
      Sach.TenSach,
      formatDate(NgayTra || "")
    );
    return sendResponse(res, 200, "Yêu cầu trả sách thành công");
  } catch (error) {
    next(error);
  }
};

function formatDate(timestamp?: string | Date): string {
  if (!timestamp) {
    return "";
  }
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}
