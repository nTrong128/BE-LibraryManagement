import prisma from "../config/prisma";
import {Docgia} from "@prisma/client";

// Find all Docgia
export const getAllDocgia = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaDocGia",
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
  let orderByClause: any = {};

  if (sortBy === "username") {
    orderByClause = {TaiKhoan: {username: sortOrder}};
  } else if (sortBy === "email") {
    orderByClause = {TaiKhoan: {email: sortOrder}};
  } else {
    orderByClause = {[sortBy]: sortOrder};
  }

  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.docgia.findMany({
      skip,
      take: pageSize,
      orderBy: orderByClause,
      where: whereClause, // Apply both the filter and the `deleted: false` condition
      include: {
        TaiKhoan: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    totalItems = await prisma.docgia.count({
      where: whereClause, // Count only non-deleted and filtered records
    });
  } else {
    itemList = await prisma.docgia.findMany({
      orderBy: orderByClause,
      where: whereClause,
      include: {
        TaiKhoan: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    totalItems = itemList.length;
  }

  const reshapedItemList = itemList.map((docGia) => {
    const {TaiKhoan, ...rest} = docGia;
    const username = TaiKhoan ? TaiKhoan.username : null;
    const email = TaiKhoan ? TaiKhoan.email : null;
    return {...rest, username, email};
  });

  return {itemList: reshapedItemList, totalItems};
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
  data: Omit<Docgia, "MaDocGia" | "NgaySinh" | "Phai" | "createAt" | "updateAt" | "deleted">
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
