import {z} from "zod";

export const NhanVienSchema = z.object({
  MSNV: z.string(),
  HoTenNV: z
    .string()
    .min(1, {message: "Họ tên không được để trống"})
    .max(50, {message: "Họ tên không được quá 50 ký tự"}),
  Password: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  ChucVu: z.string().min(1, {message: "Chức vụ không được để trống"}),
  DiaChi: z.string().min(1, {message: "Địa chỉ không được để trống"}),
  SoDienThoai: z.string().regex(/^0\d{9,10}$/),
});

export type NhanVien = z.infer<typeof NhanVienSchema>;
