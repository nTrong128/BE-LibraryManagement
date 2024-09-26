import type {Request, Response, NextFunction} from "express";
import * as NhaXuatBanService from "../services/NhaXuatBan.service";
import {NhaXuatBan} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

// Get all NhaXuatBan
export const getAllNhaXuatBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allNhaXuatBan: NhaXuatBan[] = await NhaXuatBanService.getAllNhaXuatBan();
    return sendResponse(res, 200, "Retrieved all NhaXuatBan", allNhaXuatBan);
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
