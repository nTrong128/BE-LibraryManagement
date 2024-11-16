import prisma from "../config/prisma";
import {NhanVien, Role} from "@prisma/client";

// Find all NhanVien
export const getAllNhanVien = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MSNV",
  sortOrder: "asc" | "desc" = "asc",
  search?: string | string[] | null,
  searchBy?: string | null
) => {
  let whereClause: any = {
    deleted: false,
  };

  if (searchBy && search) {
    if (searchBy === "username") {
      whereClause.TaiKhoan = {
        username: {contains: search, mode: "insensitive"}, // Case-insensitive search on username
      };
    } else if (searchBy === "email") {
      whereClause.TaiKhoan = {
        email: {contains: search, mode: "insensitive"}, // Case-insensitive search on email
      };
    } else {
      whereClause[searchBy] = {contains: search, mode: "insensitive"}; // Case-insensitive search
    }
  }

  let orderByClause: any = {};

  if (sortBy === "username") {
    orderByClause = {TaiKhoan: {username: sortOrder}};
  } else if (sortBy === "role") {
    orderByClause = {TaiKhoan: {role: sortOrder}};
  } else if (sortBy === "email") {
    orderByClause = {TaiKhoan: {email: sortOrder}};
  } else if (sortBy === "deleted") {
    whereClause.deleted = true;
  } else {
    orderByClause = {[sortBy]: sortOrder};
  }

  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.nhanVien.findMany({
      skip,
      take: pageSize,
      orderBy: orderByClause,
      where: whereClause,
      include: {
        TaiKhoan: {
          select: {
            username: true,
            role: true,
            email: true,
          },
        },
      },
    });

    totalItems = await prisma.nhanVien.count({
      where: whereClause, // Count only non-deleted and filtered records
    });
  } else {
    itemList = await prisma.nhanVien.findMany({
      orderBy: orderByClause,
      where: whereClause,
      include: {
        TaiKhoan: {
          select: {
            username: true,
            role: true,
            email: true,
          },
        },
      },
    });

    totalItems = itemList.length;
  }
  const reshapedItemList = itemList.map((nhanVien) => {
    const {TaiKhoan, ...rest} = nhanVien;
    const role = TaiKhoan ? TaiKhoan.role : null;
    const username = TaiKhoan ? TaiKhoan.username : null;
    const email = TaiKhoan ? TaiKhoan.email : null;
    return {...rest, role, username, email};
  });

  return {itemList: reshapedItemList, totalItems};
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
  return prisma.$transaction(async (tx) => {
    // First find the NhanVien to get its TaiKhoan ID
    const nhanVien = await tx.nhanVien.findUnique({
      where: {MSNV: id},
      include: {TaiKhoan: true},
    });

    if (!nhanVien || !nhanVien.TaiKhoan) {
      throw new Error("NhanVien or TaiKhoan not found");
    }

    // Update TaiKhoan's deleted status
    await tx.taiKhoan.update({
      where: {id: nhanVien.TaiKhoan.id},
      data: {deleted: true},
    });

    // Update NhanVien's deleted status
    return tx.nhanVien.update({
      where: {MSNV: id},
      data: {deleted: true},
    });
  });
};
