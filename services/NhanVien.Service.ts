import prisma from "../config/prisma";
import {NhanVien} from "@prisma/client";

// Find all NhanVien
export const getAllNhanVien = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MSNV",
  sortOrder: "asc" | "desc" = "asc",
  search?: string | null,
  searchBy?: string | null
) => {
  let whereClause: any = {
    deleted: false,
  };

  if (searchBy && search) {
    whereClause[searchBy] = {contains: search, mode: "insensitive"}; // Case-insensitive search
  }

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
      where: whereClause, // Apply both the filter and the `deleted: false` condition
    });

    totalItems = await prisma.nhanVien.count({
      where: whereClause, // Count only non-deleted and filtered records
    });
  } else {
    itemList = await prisma.nhanVien.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
      where: whereClause,
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
