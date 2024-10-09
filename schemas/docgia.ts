import {z} from "zod";

export const DocGiaSchema = z.object({
  MaDocGia: z.string().optional(),
  HoLot: z.string().min(1, {message: "Họ lót không được để trống"}),
  Ten: z.string().min(1, {message: "Tên không được để trống"}),
  DiaChi: z.string().min(1, {message: "Địa chỉ không được để trống"}),
  DienThoai: z.string().regex(/^0\d{9,10}$/, {
    message: "Số điện thoại phải bắt đầu bằng số 0 và có 10 hoặc 11 chữ số",
  }),
  Phai: z.enum(["MALE", "FEMALE"], {
    message: "Giới tính không hợp lệ",
  }),
  NgaySinh: z.coerce.date(),
});

export type DocGia = z.infer<typeof DocGiaSchema>;
