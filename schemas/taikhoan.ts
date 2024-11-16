import {z} from "zod";

export const TaiKhoanSchema = z.object({
  username: z.string().min(1, {message: "Username is required"}).optional(),
  password: z.string().min(6, {message: "Password must be at least 6 characters long"}).optional(),
  rePassword: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long"})
    .optional(),
  email: z.string().email({message: "Invalid email format"}).optional(),
  role: z.enum(["ADMIN", "NHANVIEN"]).optional(),
  HoTen: z.string().optional(),
  DienThoai: z.string().optional(),
  DiaChi: z.string().optional(),
  SoDienThoai: z.string().optional(),
  deleted: z.boolean().optional(),
  createAt: z.date().optional(),
  updateAt: z.date().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, {message: "Password must be at least 6 characters long"}),
  newPassword: z.string().min(6, {message: "Password must be at least 6 characters long"}),
  rePassword: z.string().min(6, {message: "Password must be at least 6 characters long"}),
});

export type TaiKhoan = z.infer<typeof TaiKhoanSchema>;
