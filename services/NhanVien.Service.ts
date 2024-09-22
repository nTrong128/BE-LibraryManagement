import prisma from "../config/prisma";
import {NhanVien} from "@prisma/client";

export const getAllNhanVien = async (): Promise<NhanVien[]> => {
  return prisma.nhanVien.findMany();
};

// Find NhanVien by ID
export const getNhanVienById = async (id: string): Promise<NhanVien | null> => {
  return prisma.nhanVien.findUnique({
    where: {MSNV: id},
  });
};

// Create a new NhanVien
export const createNhanVien = async (
  data: Omit<NhanVien, "MSNV" | "createAt" | "updateAt" | "deleted">
): Promise<NhanVien> => {
  return prisma.nhanVien.create({
    data,
  });
};

// Update NhanVien by ID
export const updateNhanVienById = async (
  id: string,
  data: Partial<NhanVien>
): Promise<NhanVien> => {
  return prisma.nhanVien.update({
    where: {MSNV: id},
    data,
  });
};

// Soft delete NhanVien by ID
export const softDeleteNhanVienById = async (id: string): Promise<NhanVien> => {
  return prisma.nhanVien.update({
    where: {MSNV: id},
    data: {deleted: true},
  });
};
