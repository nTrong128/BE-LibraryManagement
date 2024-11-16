import {z} from "zod";

export const NhanVienSchema = z.object({
  MSNV: z.string().optional(),
  HoTenNV: z
    .string()
    .min(1, {message: "Họ tên không được để trống"})
    .max(50, {message: "Họ tên không được quá 50 ký tự"}),
  Password: z.string().min(6, {message: "Mật khẩu phải có ít nhất 6 ký tự"}),
  ChucVu: z.string().min(1, {message: "Chức vụ không được để trống"}),
  DiaChi: z.string().min(1, {message: "Địa chỉ không được để trống"}),
  role: z.enum(["ADMIN", "NHANVIEN", "DOCGIA"]).optional(),
  username: z.string().optional(),
  SoDienThoai: z.string().regex(/^0\d{9,10}$/),
  taiKhoanId: z.string().optional(),
  email: z.string().email().optional(),
});

export type NhanVien = z.infer<typeof NhanVienSchema>;
