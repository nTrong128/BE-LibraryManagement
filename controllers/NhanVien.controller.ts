import type {Request, Response, NextFunction} from "express";
import * as nhanVienService from "../services/NhanVien.Service";
import {NhanVien} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

// Get all NhanVien
export const getAllNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allNhanVien: NhanVien[] = await nhanVienService.getAllNhanVien();
    return sendResponse(res, 200, "Retrieved all NhanVien", allNhanVien);
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
    const nhanVienData: Partial<NhanVien> = req.body;
    const updatedNhanVien: NhanVien | null = await nhanVienService.updateNhanVienById(
      id,
      nhanVienData
    );

    return sendResponse(res, 200, "NhanVien updated", updatedNhanVien);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return sendResponse(res, 404, "NhanVien not found");
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
