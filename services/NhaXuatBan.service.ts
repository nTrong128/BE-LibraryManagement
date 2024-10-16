import prisma from "../config/prisma";
import type {NhaXuatBan} from "@prisma/client";

// Find all NhaXuatBan
export const getAllNhaXuatBan = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaNXB",
  sortOrder: "asc" | "desc" = "asc",
  filterBy?: string | null,
  filter?: string | null,
  search?: string | null,
  searchBy?: string | null
) => {
  let whereClause: any = {
    deleted: false,
  };

  if (filterBy && filter) {
    whereClause[filterBy] = {contains: filter, mode: "insensitive"}; // Add filter condition
  }

  if (searchBy && search) {
    whereClause[searchBy] = {contains: search, mode: "insensitive"}; // Case-insensitive search
  }

  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.nhaXuatBan.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
      where: whereClause, // Apply both the filter and the `deleted: false` condition
    });

    totalItems = await prisma.nhaXuatBan.count({
      where: whereClause, // Count only non-deleted and filtered records
    });
  } else {
    itemList = await prisma.nhaXuatBan.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
      where: whereClause,
    });

    totalItems = itemList.length;
  }

  return {itemList, totalItems};
};

// Find NhaXuatBan by ID
export const getNhaXuatBanById = async (id: string): Promise<NhaXuatBan | null> => {
  return prisma.nhaXuatBan.findUnique({
    where: {
      MaNXB: id,
      deleted: false,
    },
  });
};

// Create a new NhaXuatBan
export const createNhaXuatBan = async (
  data: Omit<NhaXuatBan, "MaNXB" | "createAt" | "updateAt" | "deleted">
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
