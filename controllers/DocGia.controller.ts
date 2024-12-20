import type {Request, Response, NextFunction} from "express";
import * as DocgiaService from "../services/DocGia.service";
import {Docgia} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {createQuerySchema} from "../schemas/query";
import {z} from "zod";
import {AuthenticatedRequest} from "../utils/authenticateRequest";
import * as TaiKhoanService from "../services/TaiKhoan.service";

// Get all Docgia
export const getAllDocGia = async (req: Request, res: Response, next: NextFunction) => {
  const docGiaFields = z.enum([
    "MaDocGia",
    "HoTen",
    "Phai",
    "DiaChi",
    "DienThoai",
    "NgaySinh",
    "updateAt",
    "createAt",
    "deleted",
    "username",
    "email",
  ]);
  const docGiaQuerySchema = createQuerySchema(docGiaFields.options);
  const {success, data, error} = docGiaQuerySchema.safeParse(req.query);

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
    const {itemList, totalItems} = await DocgiaService.getAllDocgia(
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

      return sendResponse(res, 200, `Retrieved paginated DocGia at page ${page}`, itemList, meta);
    } else {
      return sendResponse(res, 200, "Retrieved all DocGia", itemList);
    }
  } catch (error) {
    next(error);
  }
};
// Get Docgia by ID
export const getDocGiaById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const {id} = req.params;

  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Docgia ID");
  }
  const userId = req.userId;
  const role = req.role;

  try {
    const Docgia: Docgia | null = await DocgiaService.getDocgiaById(id);

    if (!Docgia) {
      return sendResponse(res, 404, "Docgia not found");
    }
    sendResponse(res, 200, "Retrieved Docgia", Docgia);
  } catch (error) {
    console.error("Error fetching Docgia:", error);
    next(error);
  }
};

// Create new Docgia
export const createDocGia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const DocgiaData: Omit<Docgia, "MSNV" | "createAt" | "updateAt" | "deleted"> = req.body;
    const newDocgia: Docgia = await DocgiaService.createDocgia(DocgiaData);
    return sendResponse(res, 201, "Docgia created", newDocgia);
  } catch (error) {
    next(error);
  }
};

// Update Docgia by ID
export const updateDocgia = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Docgia ID");
  }

  try {
    const DocgiaData: Partial<Docgia> & {email: string; taiKhoanId: string} = req.body;
    const {email, taiKhoanId, ...rest} = DocgiaData;
    const updatedDocgia: Docgia | null = await DocgiaService.updateDocgiaById(id, rest);
    if (!updatedDocgia) {
      return sendResponse(res, 404, "Không tìm thấy đọc giả");
    }
    if (email !== undefined) {
      await TaiKhoanService.updateTaiKhoanById(taiKhoanId, {email});
    }

    return sendResponse(res, 200, "Docgia updated", updatedDocgia);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "Docgia not found");
    }
    next(error);
  }
};

// Soft delete Docgia by ID
export const deleteDocGia = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Docgia ID");
  }

  try {
    const result = await DocgiaService.softDeleteDocgiaById(id);

    if (!result) {
      return sendResponse(res, 404, "Docgia not found");
    }

    return sendResponse(res, 204);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "Docgia not found");
    }
    next(error);
  }
};
