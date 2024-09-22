import type {Request, Response, NextFunction} from "express";
import * as nhanVienService from "../services/NhanVien.Service";
import {NhanVien} from "@prisma/client";

// Get all NhanVien
export const getAllNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allNhanVien: NhanVien[] = await nhanVienService.getAllNhanVien();
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Retrieved all NhanVien",
      data: allNhanVien,
    });
  } catch (error) {
    next(error);
  }
};

// Get NhanVien by ID
export const getNhanVienById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const nhanVien: NhanVien | null = await nhanVienService.getNhanVienById(id);

    if (!nhanVien) {
      return res.status(404).json({message: "NhanVien not found"});
    }

    res.status(200).json(nhanVien);
  } catch (error) {
    next(error);
  }
};

// Create new NhanVien
export const createNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nhanVienData: Omit<NhanVien, "MSNV" | "createAt" | "updateAt" | "deleted"> = req.body;
    const newNhanVien: NhanVien = await nhanVienService.createNhanVien(nhanVienData);
    res.status(201).json(newNhanVien);
  } catch (error) {
    next(error);
  }
};

// Update NhanVien by ID
export const updateNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const nhanVienData: Partial<NhanVien> = req.body;
    const updatedNhanVien: NhanVien = await nhanVienService.updateNhanVienById(id, nhanVienData);
    res.status(200).json(updatedNhanVien);
  } catch (error) {
    next(error);
  }
};

// Soft delete NhanVien by ID
export const deleteNhanVien = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await nhanVienService.softDeleteNhanVienById(id);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};
