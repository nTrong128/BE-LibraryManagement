import prisma from "../config/prisma";
import {NhanVien} from "@prisma/client";

// Find all NhanVien
export const getAllNhanVien = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MSNV",
  sortOrder: "asc" | "desc" = "asc"
) => {
  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.nhanVien.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = await prisma.nhanVien.count();
  } else {
    itemList = await prisma.nhanVien.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = itemList.length;
  }

  return {itemList, totalItems};
};

// Find NhanVien by ID
export const getNhanVienById = async (id: string): Promise<NhanVien | null> => {
  return prisma.nhanVien.findUnique({
    where: {
      MSNV: id,
      deleted: false,
    },
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
