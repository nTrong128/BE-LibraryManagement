import prisma from "../config/prisma";
import {Sach} from "@prisma/client";

// Find all Sach
export const getAllSach = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaSach",
  sortOrder: "asc" | "desc" = "asc"
) => {
  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.sach.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = await prisma.sach.count();
  } else {
    itemList = await prisma.sach.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = itemList.length;
  }

  return {itemList, totalItems};
};

// Find Sach by ID
export const getSachById = async (id: string): Promise<Sach | null> => {
  return prisma.sach.findUnique({
    where: {
      MaSach: id,
      deleted: false,
    },
  });
};

// Create a new Sach
export const createSach = async (
  data: Omit<Sach, "MaSach" | "createAt" | "updateAt" | "deleted">
): Promise<Sach> => {
  return prisma.sach.create({
    data,
  });
};

// Update Sach by ID
export const updateSachById = async (id: string, data: Partial<Sach>): Promise<Sach> => {
  return prisma.sach.update({
    where: {MaSach: id},
    data,
  });
};

// Soft delete Sach by ID
export const softDeleteSachById = async (id: string): Promise<Sach> => {
  return prisma.sach.update({
    where: {MaSach: id},
    data: {deleted: true},
  });
};
