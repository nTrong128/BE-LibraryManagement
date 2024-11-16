import {z} from "zod";

export const MuonSachSchema = z.object({
  MaMuon: z.string().optional(),
  MaDocGia: z.string().min(1, {message: " Độc giả không được để trống"}),
  MaNhanVien: z.string().min(1, {message: "Nhân viên không được để trống"}).optional(),
  MaSach: z.string().min(1, {message: "Sách không được để trống"}),
  NgayMuon: z.coerce.date().optional(),
  NgayTra: z.coerce.date().optional(),
  NgayYeuCau: z.coerce.date().optional(),
  NgayXacNhan: z.coerce.date().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "BORROWED", "RETURNED", "OVERDUE"]).optional(),
});

export type MuonSach = z.infer<typeof MuonSachSchema>;
