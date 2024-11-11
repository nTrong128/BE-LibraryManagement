import type {Request, Response, NextFunction} from "express";
import * as NhaXuatBanService from "../services/NhaXuatBan.service";
import {NhaXuatBan} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {z} from "zod";
import {createQuerySchema} from "../schemas/query";

// Get all NhaXuatBan
export const getAllNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
  const nxbFields = z.enum(["MaNXB", "TenNXB", "DiaChi", "updateAt", "createAt", "deleted"]);

  const nxbQuerySchema = createQuerySchema(nxbFields.options);
  const {success, data, error} = nxbQuerySchema.safeParse(req.query);

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
    const {itemList, totalItems} = await NhaXuatBanService.getAllNhaXuatBan(
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

      return sendResponse(
        res,
        200,
        `Retrieved paginated NhaXuatBan at page ${page}`,
        itemList,
        meta
      );
    } else {
      return sendResponse(res, 200, "Retrieved all NhaXuatBan", itemList);
    }
  } catch (error) {
    next(error);
  }
};

// Get NhaXuatBan by ID
export const getNhaXuatBanById = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid NhaXuatBan ID");
  }
  try {
    const NhaXuatBan: NhaXuatBan | null = await NhaXuatBanService.getNhaXuatBanById(id);

    if (!NhaXuatBan) {
      return sendResponse(res, 404, "NhaXuatBan not found");
    }
    sendResponse(res, 200, "Retrieved NhaXuatBan", NhaXuatBan);
  } catch (error) {
    console.error("Error fetching NhaXuatBan:", error);
    next(error);
  }
};

// Create new NhaXuatBan
export const createNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const NhaXuatBanData: Omit<NhaXuatBan, "MSNV" | "createAt" | "updateAt" | "deleted"> = req.body;
    const newNhaXuatBan: NhaXuatBan = await NhaXuatBanService.createNhaXuatBan(NhaXuatBanData);
    return sendResponse(res, 201, "NhaXuatBan created", newNhaXuatBan);
  } catch (error) {
    next(error);
  }
};

// Update NhaXuatBan by ID
export const updateNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid NhaXuatBan ID");
  }

  try {
    const NhaXuatBanData: Partial<NhaXuatBan> = req.body;
    const updatedNhaXuatBan: NhaXuatBan | null = await NhaXuatBanService.updateNhaXuatBanById(
      id,
      NhaXuatBanData
    );

    return sendResponse(res, 200, "NhaXuatBan updated", updatedNhaXuatBan);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "NhaXuatBan not found");
    }
    next(error);
  }
};

// Soft delete NhaXuatBan by ID
export const deleteNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid NhaXuatBan ID");
  }

  try {
    const result = await NhaXuatBanService.softDeleteNhaXuatBanById(id);

    if (!result) {
      return sendResponse(res, 404, "NhaXuatBan not found");
    }

    return sendResponse(res, 204);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "NhaXuatBan not found");
    }
    next(error);
  }
};
