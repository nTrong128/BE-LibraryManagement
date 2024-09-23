import prisma from "../config/prisma";
import {NhaXuatBan} from "@prisma/client";

export const getAllNhaXuatBan = async (): Promise<NhaXuatBan[]> => {
  return prisma.nhaXuatBan.findMany();
};

// Find NhaXuatBan by ID
export const getNhaXuatBanById = async (id: string): Promise<NhaXuatBan | null> => {
  return prisma.nhaXuatBan.findUnique({
    where: {MaNXB: id},
  });
};

// Create a new NhaXuatBan
export const createNhaXuatBan = async (
  data: Omit<NhaXuatBan, "MSNV" | "createAt" | "updateAt" | "deleted">
): Promise<NhaXuatBan> => {
  return prisma.nhaXuatBan.create({
    data,
  });
};

// Update NhaXuatBan by ID
export const updateNhaXuatBanById = async (
  id: string,
  data: Partial<NhaXuatBan>
): Promise<NhaXuatBan> => {
  return prisma.nhaXuatBan.update({
    where: {MaNXB: id},
    data,
  });
};

// Soft delete NhaXuatBan by ID
export const softDeleteNhaXuatBanById = async (id: string): Promise<NhaXuatBan> => {
  return prisma.nhaXuatBan.update({
    where: {MaNXB: id},
    data: {deleted: true},
  });
};
