import {z} from "zod";

export const SachSchema = z.object({
  MaSach: z.string().optional(),
  TenSach: z.string().min(1, {message: "Tên sách không được để trống"}),
  DonGia: z
    .number()
    .min(0, {message: "Đơn giá phải lớn hơn hoặc bằng 0"})
    .max(10000000, {message: "Đơn giá phải nhỏ hơn 10.000.000"}),
  SoQuyen: z
    .number({message: "Số quyển không được để trống"})
    .int()
    .min(0, {message: "Số quyển phải lớn hơn hoặc bằng 0"})
    .max(1000, {message: "Số quyển phải nhỏ hơn 1000"}),
  NamXuatBan: z
    .number({message: "Năm xuất bản không được để trống"})
    .int()
    .min(1000, {message: "Năm xuất bản phải lớn hơn hoặc bằng 1000"})
    .max(new Date().getFullYear(), {message: "Năm xuất bản phải nhỏ hơn hoặc bằng năm hiện tại"}),
  MaNXB: z.string().min(1, {message: "Nhà xuất bản không được để trống"}),
  NguonGoc: z.string().min(1, {message: "Nguồn gốc không được để trống"}),
});

export type Sach = z.infer<typeof SachSchema>;
