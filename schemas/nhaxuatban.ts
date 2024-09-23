import {z} from "zod";

export const NhaXuatBanSchema = z.object({
  MaNXB: z.string().optional(),
  TenNXB: z.string().min(1, {message: "Tên nhà xuất bản không được để trống"}),
  DiaChi: z.string().min(1, {message: "Địa chỉ không được để trống"}),
  updateAt: z.date().optional(),
  createAt: z.date().optional(),
  deleted: z.boolean().optional(),
});

export type NhaXuatBan = z.infer<typeof NhaXuatBanSchema>;
