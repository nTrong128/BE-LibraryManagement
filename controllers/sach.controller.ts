import type {Request, Response, NextFunction} from "express";
import * as SachService from "../services/sach.service";
import {Sach} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {createQuerySchema} from "../schemas/query";
import {z} from "zod";

// Get all Sach
export const getAllSach = async (req: Request, res: Response, next: NextFunction) => {
  const sachFields = z.enum([
    "MaSach",
    "TenSach",
    "TenNXB",
    "DonGia",
    "SoQuyen",
    "NamXuatBan",
    "MaNXB",
    "NguonGoc",
    "updateAt",
    "createAt",
    "deleted",
  ]);

  const sachQuerySchema = createQuerySchema(sachFields.options);
  const {success, data, error} = sachQuerySchema.safeParse(req.query);

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
    const {itemList, totalItems} = await SachService.getAllSach(
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

      return sendResponse(res, 200, `Retrieved Sach at page ${page}`, itemList, meta);
    } else {
      return sendResponse(res, 200, "Retrieved all Sach", itemList);
    }
  } catch (error) {
    next(error);
  }
};
// Get Sach by ID
export const getSachById = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Sach ID");
  }
  try {
    const Sach: Sach | null = await SachService.getSachById(id);

    if (!Sach) {
      return sendResponse(res, 404, "Sach not found");
    }
    sendResponse(res, 200, "Retrieved Sach", Sach);
  } catch (error) {
    console.error("Error fetching Sach:", error);
    next(error);
  }
};

// Create new Sach
export const createSach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const SachData: Omit<Sach, "MaSach" | "createAt" | "updateAt" | "deleted"> = req.body;

    if (!isValidObjectId(SachData.MaNXB)) {
      return sendResponse(res, 400, "Invalid NhaXuatBan ID");
    }

    const newSach: Sach = await SachService.createSach(SachData);
    return sendResponse(res, 201, "Sach created", newSach);
  } catch (error) {
    next(error);
  }
};

// Update Sach by ID
export const updateSach = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Sach ID");
  }

  try {
    const SachData: Partial<Sach> = req.body;
    if (SachData.MaNXB && !isValidObjectId(SachData.MaNXB)) {
      return sendResponse(res, 400, "Invalid NhaXuatBan ID");
    }

    const updatedSach: Sach | null = await SachService.updateSachById(id, SachData);

    return sendResponse(res, 200, "Sach updated", updatedSach);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "Sach not found");
    }
    next(error);
  }
};

// Soft delete Sach by ID
export const deleteSach = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Sach ID");
  }

  try {
    const result = await SachService.softDeleteSachById(id);

    if (!result) {
      return sendResponse(res, 404, "Sach not found");
    }

    return sendResponse(res, 204);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "Sach not found");
    }
    next(error);
  }
};
