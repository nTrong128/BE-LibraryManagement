import prisma from "../config/prisma";
import {Docgia} from "@prisma/client";

// Find all Docgia
export const getAllDocgia = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaDocGia",
  sortOrder: "asc" | "desc" = "asc"
) => {
  let itemList;
  let totalItems;
  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.docgia.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = await prisma.docgia.count();
  } else {
    itemList = await prisma.docgia.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = itemList.length;
  }

  return {itemList, totalItems};
};

// Find Docgia by ID
export const getDocgiaById = async (id: string): Promise<Docgia | null> => {
  return prisma.docgia.findUnique({
    where: {
      MaDocGia: id,
      deleted: false,
    },
  });
};

// Create a new Docgia
export const createDocgia = async (
  data: Omit<Docgia, "MaDocGia" | "createAt" | "updateAt" | "deleted">
): Promise<Docgia> => {
  return prisma.docgia.create({
    data,
  });
};

// Update Docgia by ID
export const updateDocgiaById = async (id: string, data: Partial<Docgia>): Promise<Docgia> => {
  return prisma.docgia.update({
    where: {MaDocGia: id},
    data,
  });
};

// Soft delete Docgia by ID
export const softDeleteDocgiaById = async (id: string): Promise<Docgia> => {
  return prisma.docgia.update({
    where: {MaDocGia: id},
    data: {deleted: true},
  });
};
