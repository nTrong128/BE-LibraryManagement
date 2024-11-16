import type {Request, Response, NextFunction} from "express";
import * as nhanVienService from "../services/NhanVien.service";
import * as TaiKhoanService from "../services/TaiKhoan.service";
import {NhanVien, Role} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {createQuerySchema} from "../schemas/query";
import {z} from "zod";
// Get all NhanVien
export const getAllNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  const nhanVienFields = z.enum([
    "MSNV",
    "HoTenNV",
    "ChucVu",
    "DiaChi",
    "email",
    "SoDienThoai",
    "createAt",
    "updateAt",
    "deleted",
    "role",
    "username",
    "deleted",
  ]);

  const nhanVienQuerySchema = createQuerySchema(nhanVienFields.options);
  const {success, data, error} = nhanVienQuerySchema.safeParse(req.query);

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
    const {itemList, totalItems} = await nhanVienService.getAllNhanVien(
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

      return sendResponse(res, 200, `Retrieved paginated NhanVien at page ${page}`, itemList, meta);
    } else {
      return sendResponse(res, 200, "Retrieved all NhanVien", itemList);
    }
  } catch (error) {
    next(error);
  }
};

// Get NhanVien by ID
export const getNhanVienById = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid NhanVien ID");
  }
  try {
    const nhanVien: NhanVien | null = await nhanVienService.getNhanVienById(id);

    if (!nhanVien) {
      return sendResponse(res, 404, "NhanVien not found");
    }
    sendResponse(res, 200, "Retrieved NhanVien", nhanVien);
  } catch (error) {
    console.error("Error fetching NhanVien:", error);
    next(error);
  }
};

// Create new NhanVien
export const createNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nhanVienData: Omit<NhanVien, "MSNV" | "createAt" | "updateAt" | "deleted"> = req.body;
    const newNhanVien: NhanVien = await nhanVienService.createNhanVien(nhanVienData);
    return sendResponse(res, 201, "NhanVien created", newNhanVien);
  } catch (error) {
    next(error);
  }
};

// Update NhanVien by ID
export const updateNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid NhanVien ID");
  }

  try {
    const nhanVienData: Partial<NhanVien> & {role: Role; email: string; taiKhoanId: string} =
      req.body;
    const {role, email, taiKhoanId, ...rest} = nhanVienData;

    const updatedNhanVien: NhanVien | null = await nhanVienService.updateNhanVienById(id, rest);

    if (!updatedNhanVien) {
      return sendResponse(res, 404, "Không tìm thấy nhân viên");
    }

    if (role !== undefined) {
      await TaiKhoanService.updateTaiKhoanRoleById(taiKhoanId, role);
    }
    if (email !== undefined) {
      await TaiKhoanService.updateTaiKhoanById(taiKhoanId, {email});
    }

    return sendResponse(res, 200, "Cập nhật nhân viên", nhanVienData);
  } catch (error) {
    console.log("ERROR:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "ID không hơp lệ");
    }
    next(error);
  }
};

// Soft delete NhanVien by ID
export const deleteNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid NhanVien ID");
  }

  try {
    const result = await nhanVienService.softDeleteNhanVienById(id);

    if (!result) {
      return sendResponse(res, 404, "NhanVien not found");
    }

    return sendResponse(res, 200, "NhanVien deleted");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "NhanVien not found");
    }
    next(error);
  }
};
