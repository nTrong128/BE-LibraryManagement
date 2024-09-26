import type {Request, Response, NextFunction} from "express";
import * as DocgiaService from "../services/DocGia.service";
import {Docgia} from "@prisma/client";
import {isValidObjectId} from "../utils/validObject";
import {sendResponse} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

// Get all Docgia
export const getAllDocGia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allDocgia: Docgia[] = await DocgiaService.getAllDocgia();
    return sendResponse(res, 200, "Retrieved all Docgia", allDocgia);
  } catch (error) {
    next(error);
  }
};

// Get Docgia by ID
export const getDocGiaById = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!isValidObjectId(id)) {
    return sendResponse(res, 400, "Invalid Docgia ID");
  }
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
    const DocgiaData: Partial<Docgia> = req.body;
    const updatedDocgia: Docgia | null = await DocgiaService.updateDocgiaById(id, DocgiaData);

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
