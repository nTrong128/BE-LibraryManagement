import {z} from "zod";

export const TaiKhoanSchema = z.object({
  MaTaiKhoan: z.string().optional(),
  username: z.string().min(1, {message: "Tên đăng nhập không được để trống"}),
  password: z.string().min(1, {message: "Mật khẩu không được để trống"}),
  email: z.string().email().min(1, {message: "Email không được để trống"}),
});
