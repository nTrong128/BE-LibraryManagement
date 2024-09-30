import {z} from "zod";

export const SachSchema = z.object({
  MaSach: z.string().optional(),
  TenSach: z.string().min(1, {message: "Tên sách không được để trống"}),
  DonGia: z.number().min(0, {message: "Đơn giá phải lớn hơn hoặc bằng 0"}).optional(),
  SoQuyen: z.number({message: "Số quyển không được để trống"}).int(),
  NamXuatBan: z.number({message: "Năm xuất bản không được để trống"}).int(),
  MaNXB: z.string().min(1, {message: "Nhà xuất bản không được để trống"}),
  NguonGoc: z.string().min(1, {message: "Nguồn gốc không được để trống"}),
});

export type Sach = z.infer<typeof SachSchema>;
