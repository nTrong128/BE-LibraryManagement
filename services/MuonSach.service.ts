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
        Docgia: {
          include: {
            TaiKhoan: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
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
        Docgia: {
          include: {
            TaiKhoan: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        Sach: true,
      },
    });

    totalItems = itemList.length;
  }
  itemList.forEach((item) => {
    if (item.NgayTra) {
      const date = new Date(item.NgayTra);
      const currentDate = new Date();
      if (date < currentDate && item.status === BorrowStatus.BORROWED) {
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
      Docgia: {
        include: {
          TaiKhoan: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
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
      Docgia: {
        include: {
          TaiKhoan: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
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
        Docgia: {
          include: {
            TaiKhoan: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
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
        Docgia: {
          include: {
            TaiKhoan: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        Sach: true,
      },
    });

    totalItems = itemList.length;
  }

  itemList.forEach((item) => {
    if (item.NgayTra) {
      const date = new Date(item.NgayTra);
      const currentDate = new Date();
      if (date < currentDate && item.status === BorrowStatus.BORROWED) {
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
      Docgia: {
        include: {
          TaiKhoan: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
      Sach: true,
    },
  });
};

// Update MuonSach by ID
// export const updateMuonSachById = async (id: string, data: Partial<MuonSach>) => {
//   if (data.status === BorrowStatus.ACCEPTED) {

//     data.NgayXacNhan = new Date();
//   }
//   if (data.status === BorrowStatus.REJECTED) {
//     data.hoanThanh = new Date();
//   }
//   if (data.status === BorrowStatus.RETURNED) {
//     data.hoanThanh = new Date();
//   }

//   return prisma.muonSach.update({
//     where: {MaMuon: id},
//     data,
//     include: {
//       NhanVien: true,
//       Docgia: true,
//       Sach: true,
//     },
//   });
// };

// Update MuonSach by ID
export const updateMuonSachById = async (id: string, data: Partial<MuonSach>) => {
  return prisma.$transaction(async (tx) => {
    // Fetch the existing MuonSach record along with related Sach
    const existingMuonSach = await tx.muonSach.findUnique({
      where: {MaMuon: id},
      include: {Sach: true},
    });

    if (!existingMuonSach) {
      throw new Error("MuonSach not found");
    }

    // Initialize variables to track SoQuyen changes
    let soQuyenChange = 0;

    // Handle status updates
    if (data.status) {
      switch (data.status) {
        case BorrowStatus.ACCEPTED:
          // Ensure there are available copies to borrow
          if (existingMuonSach.Sach.SoQuyen <= 0) {
            throw new Error("No available copies to borrow.");
          }
          soQuyenChange = -1; // Decrease SoQuyen by 1
          data.NgayXacNhan = new Date();
          break;

        case BorrowStatus.RETURNED:
          soQuyenChange = 1; // Increase SoQuyen by 1
          data.NgayTra = new Date();
          data.hoanThanh = new Date();
          break;

        default:
          // No change to SoQuyen for other statuses
          break;
      }
    }

    // If there's a change in SoQuyen, update Sach accordingly
    if (soQuyenChange !== 0) {
      await tx.sach.update({
        where: {MaSach: existingMuonSach.MaSach},
        data: {
          SoQuyen: {
            increment: soQuyenChange > 0 ? soQuyenChange : undefined,
            decrement: soQuyenChange < 0 ? Math.abs(soQuyenChange) : undefined,
          },
        },
      });
    }

    // Perform the MuonSach update
    const updatedMuonSach = await tx.muonSach.update({
      where: {MaMuon: id},
      data,
      include: {
        NhanVien: true,
        Docgia: {
          include: {
            TaiKhoan: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        Sach: true,
      },
    });

    return updatedMuonSach;
  });
};

// Soft delete MuonSach by ID
export const softDeleteMuonSachById = async (id: string) => {
  return prisma.muonSach.update({
    where: {MaMuon: id},
    data: {deleted: true},
    include: {
      NhanVien: true,
      Docgia: {
        include: {
          TaiKhoan: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
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
      Docgia: {
        include: {
          TaiKhoan: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
      Sach: true,
    },
  });
};
