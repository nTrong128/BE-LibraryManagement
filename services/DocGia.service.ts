import prisma from "../config/prisma";
import {Docgia} from "@prisma/client";

// Find all Docgia
export const getAllDocgia = async (): Promise<Docgia[]> => {
  return prisma.docgia.findMany();
};

// Find Docgia by ID
export const getDocgiaById = async (id: string): Promise<Docgia | null> => {
  return prisma.docgia.findUnique({
    where: {MaDocGia: id},
  });
};

// Create a new Docgia
export const createDocgia = async (
  data: Omit<Docgia, "MSNV" | "createAt" | "updateAt" | "deleted">
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
