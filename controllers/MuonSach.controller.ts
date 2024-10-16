import type {Request, Response, NextFunction} from "express";
import * as MuonSachService from "../services/MuonSach.service";
import {MuonSach} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {createQuerySchema} from "../schemas/query";
import {z} from "zod";
// Get all MuonSach
export const getAllMuonSach = async (req: Request, res: Response, next: NextFunction) => {
  const muonSachFields = z.enum([
    "MaMuon",
    "MaDocGia",
    "MaSach",
    "MaNhanVien",
    "NgayMuon",
    "NgayTra",
    "NgayXacNhan",
    "status",
    "createAt",
    "updateAt",
    "deleted",
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
      sortOrder
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

      return sendResponse(res, 200, `Retrieved paginated NhanVien at page ${page}`, itemList, meta);
    } else {
      return sendResponse(res, 200, "Retrieved all NhanVien", itemList);
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
    const MuonSach: MuonSach | null = await MuonSachService.getMuonSachById(id);

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
    const MuonSach: MuonSach[] | null = await MuonSachService.getMuonSachBySachId(id);

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
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid MuonSach ID");
  }
  try {
    const MuonSach: MuonSach[] | null = await MuonSachService.getMuonSachByDocGiaId(id);

    if (!MuonSach) {
      return sendResponse(res, 404, "MuonSach not found");
    }
    sendResponse(res, 200, "Retrieved MuonSach", MuonSach);
  } catch (error) {
    console.error("Error fetching MuonSach:", error);
    next(error);
  }
};

// Create new MuonSach
export const createMuonSach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const MuonSachData: Omit<MuonSach, "MaMuon" | "DonGia" | "createAt" | "updateAt" | "deleted"> =
      req.body;
    const newMuonSach: MuonSach = await MuonSachService.createMuonSach(MuonSachData);
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
    const updatedSach: MuonSach | null = await MuonSachService.updateMuonSachById(id, MuonSachData);

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
