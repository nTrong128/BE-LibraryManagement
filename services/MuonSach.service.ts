import prisma from "../config/prisma";
import {MuonSach} from "@prisma/client";

// Find all MuonSach
export const getAllMuonSach = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaMuon",
  sortOrder: "asc" | "desc" = "asc"
) => {
  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.muonSach.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = await prisma.muonSach.count();
  } else {
    itemList = await prisma.muonSach.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    totalItems = itemList.length;
  }

  return {itemList, totalItems};
};

// Find MuonSach by ID
export const getMuonSachById = async (id: string): Promise<MuonSach | null> => {
  return prisma.muonSach.findUnique({
    where: {
      MaMuon: id,
      deleted: false,
    },
  });
};

// Find MuonSach by Sach ID
export const getMuonSachBySachId = async (id: string): Promise<MuonSach[] | null> => {
  return prisma.muonSach.findMany({
    where: {
      MaSach: id,
      deleted: false,
    },
  });
};

// Find MuonSach by DocGia ID
export const getMuonSachByDocGiaId = async (id: string): Promise<MuonSach[] | null> => {
  return prisma.muonSach.findMany({
    where: {
      MaDocGia: id,
      deleted: false,
    },
  });
};

// Create a new MuonSach
export const createMuonSach = async (
  data: Omit<MuonSach, "MaMuon" | "createAt" | "updateAt" | "deleted">
): Promise<MuonSach> => {
  return prisma.muonSach.create({
    data,
  });
};

// Update MuonSach by ID
export const updateMuonSachById = async (
  id: string,
  data: Partial<MuonSach>
): Promise<MuonSach> => {
  return prisma.muonSach.update({
    where: {MaMuon: id},
    data,
  });
};

// Soft delete MuonSach by ID
export const softDeleteMuonSachById = async (id: string): Promise<MuonSach> => {
  return prisma.muonSach.update({
    where: {MaMuon: id},
    data: {deleted: true},
  });
};
