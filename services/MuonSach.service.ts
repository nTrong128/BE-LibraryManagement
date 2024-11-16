import prisma from "../config/prisma";
import {MuonSach, BorrowStatus} from "@prisma/client";

// Find all MuonSach
export const getAllMuonSach = async (
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaMuon",
  sortOrder: "asc" | "desc" = "asc",
  search?: string | null,
  searchBy?: string | null
) => {
  let whereClause: any = {
    deleted: false,
  };

  if (searchBy && search) {
    if (searchBy === "TenSach") {
      whereClause.Sach = {TenSach: {contains: search, mode: "insensitive"}}; // Case-insensitive search on TenSach
    } else if (searchBy === "status") {
      if (search === "OVERDUE") {
        whereClause.NgayTra = {lt: new Date()};
        whereClause.status = BorrowStatus.BORROWED;
      } else {
        whereClause.status = {contains: search, mode: "insensitive"}; // Case-insensitive search
      }
    } else whereClause[searchBy] = {contains: search, mode: "insensitive"}; // Case-insensitive search
  }
  let orderByClause: any = {};
  if (sortBy === "TenSach") {
    orderByClause = {Sach: {TenSach: sortOrder}};
  } else {
    orderByClause = {[sortBy]: sortOrder};
  }
  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.muonSach.findMany({
      skip,
      take: pageSize,
      orderBy: orderByClause,
      where: whereClause, // Apply both the filter and the `deleted: false` condition
      include: {
        NhanVien: true,
        Docgia: true,
        Sach: true,
      },
    });

    totalItems = await prisma.muonSach.count({
      where: whereClause, // Count only non-deleted and filtered records
    });
  } else {
    itemList = await prisma.muonSach.findMany({
      orderBy: orderByClause,
      where: whereClause,
      include: {
        NhanVien: true,
        Docgia: true,
        Sach: true,
      },
    });

    totalItems = itemList.length;
  }
  itemList.forEach((item) => {
    if (item.NgayTra) {
      const date = new Date(item.NgayTra);
      const currentDate = new Date();
      if (date < currentDate) {
        item.status = BorrowStatus.OVERDUE;
      }
    }
  });

  return {itemList, totalItems};
};

// Find MuonSach by ID
export const getMuonSachById = async (id: string) => {
  return prisma.muonSach.findUnique({
    where: {
      MaMuon: id,
      deleted: false,
    },
    include: {
      NhanVien: true,
      Docgia: true,
      Sach: true,
    },
  });
};

// Find MuonSach by Sach ID
export const getMuonSachBySachId = async (id: string) => {
  return prisma.muonSach.findMany({
    where: {
      MaSach: id,
      deleted: false,
    },
    include: {
      NhanVien: true,
      Docgia: true,
      Sach: true,
    },
  });
};

// Find MuonSach by DocGia ID
export const getMuonSachByDocGiaId = async (
  id: string,
  pageSize: number,
  page?: number | null,
  sortBy: string = "MaMuon",
  sortOrder: "asc" | "desc" = "asc",
  search?: string | string[] | null,
  searchBy?: string | null
) => {
  let whereClause: any = {
    deleted: false,
    MaDocGia: id,
  };

  if (searchBy && search) {
    if (searchBy === "TenSach") {
      whereClause.Sach = {TenSach: {contains: search, mode: "insensitive"}}; // Case-insensitive search on TenSach
    } else if (searchBy === "status") {
      if (search === "OVERDUE") {
        whereClause.NgayTra = {lt: new Date()};
        whereClause.status = BorrowStatus.BORROWED;
      } else {
        whereClause.status = {contains: search, mode: "insensitive"}; // Case-insensitive search
      }
    } else whereClause[searchBy] = {contains: search, mode: "insensitive"}; // Case-insensitive search
  }
  let orderByClause: any = {};
  if (sortBy === "TenSach") {
    orderByClause = {Sach: {TenSach: sortOrder}};
  } else {
    orderByClause = {[sortBy]: sortOrder};
  }

  let itemList;
  let totalItems;

  if (page) {
    const skip = (page - 1) * pageSize;

    itemList = await prisma.muonSach.findMany({
      skip,
      take: pageSize,
      orderBy: orderByClause,
      where: whereClause, // Apply both the filter and the `deleted: false` condition
      include: {
        NhanVien: true,
        Docgia: true,
        Sach: true,
      },
    });

    totalItems = await prisma.muonSach.count({
      where: whereClause, // Count only non-deleted and filtered records
    });
  } else {
    itemList = await prisma.muonSach.findMany({
      orderBy: orderByClause,
      where: whereClause,
      include: {
        NhanVien: true,
        Docgia: true,
        Sach: true,
      },
    });

    totalItems = itemList.length;
  }

  itemList.forEach((item) => {
    if (item.NgayTra) {
      const date = new Date(item.NgayTra);
      const currentDate = new Date();
      if (date < currentDate) {
        item.status = BorrowStatus.OVERDUE;
      }
    }
  });

  return {itemList, totalItems};
};

// Create a new MuonSach
export const createMuonSach = async (
  data: Omit<MuonSach, "MaMuon" | "createAt" | "updateAt" | "deleted">
) => {
  return prisma.muonSach.create({
    data,
    include: {
      NhanVien: true,
      Docgia: true,
      Sach: true,
    },
  });
};

// Update MuonSach by ID
export const updateMuonSachById = async (id: string, data: Partial<MuonSach>) => {
  if (data.status === BorrowStatus.ACCEPTED) {
    data.NgayXacNhan = new Date();
  }
  if (data.status === BorrowStatus.REJECTED) {
    data.hoanThanh = new Date();
  }
  if (data.status === BorrowStatus.RETURNED) {
    data.hoanThanh = new Date();
  }

  return prisma.muonSach.update({
    where: {MaMuon: id},
    data,
    include: {
      NhanVien: true,
      Docgia: true,
      Sach: true,
    },
  });
};

// Soft delete MuonSach by ID
export const softDeleteMuonSachById = async (id: string) => {
  return prisma.muonSach.update({
    where: {MaMuon: id},
    data: {deleted: true},
    include: {
      NhanVien: true,
      Docgia: true,
      Sach: true,
    },
  });
};

export const getMuonSachByDocGiaIdAndSachId = async (docGiaId: string, sachId: string) => {
  return prisma.muonSach.findMany({
    where: {
      MaDocGia: docGiaId,
      MaSach: sachId,
      status: {
        in: [BorrowStatus.PENDING, BorrowStatus.ACCEPTED, BorrowStatus.BORROWED],
      },
      deleted: false,
    },
    include: {
      NhanVien: true,
      Docgia: true,
      Sach: true,
    },
  });
};
