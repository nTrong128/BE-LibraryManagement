import prisma from "../config/prisma";
import {TaiKhoan, Docgia, Role} from "@prisma/client";
import bcrypt from "bcrypt";
import {sendResponse} from "../utils/response";

export const createTaiKhoan = async (
  data: Omit<TaiKhoan, "id" | "createAt" | "updateAt" | "deleted">
) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  const user = prisma.taiKhoan.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};

export const login = async (username: string, password: string) => {
  const account = await prisma.taiKhoan.findFirst({
    where: {
      username,
    },
  });
  if (!account) {
    return null;
  }
  const match = await bcrypt.compare(password, account.password);
  if (!match) {
    return null;
  }
  return account;
};

export const getTaiKhoanById = async (id: string): Promise<TaiKhoan | null> => {
  return prisma.taiKhoan.findUnique({
    where: {
      id,
      deleted: false,
    },
  });
};

export const getTaiKhoanByEmail = async (email: string): Promise<TaiKhoan | null> => {
  return prisma.taiKhoan.findUnique({
    where: {
      email,
      deleted: false,
    },
  });
};

export const getTaiKhoanByUserNameOrEmail = async (
  username: string,
  email: string
): Promise<TaiKhoan | null> => {
  return prisma.taiKhoan.findFirst({
    where: {
      OR: [{username}, {email}],
    },
  });
};

export const updateTaiKhoanById = async (id: string, data: Partial<TaiKhoan>) => {
  return prisma.taiKhoan.update({
    where: {id},
    data,
  });
};

export const updateTaiKhoanByEmail = async (email: string, data: Partial<TaiKhoan>) => {
  return prisma.taiKhoan.update({
    where: {email},
    data,
  });
};

export const getTaiKhoanByResetToken = async (resetToken: string): Promise<TaiKhoan | null> => {
  return prisma.taiKhoan.findFirst({
    where: {
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: {
        gt: new Date(),
      },
    },
  });
};
