import {z} from "zod";

export const MuonSachSchema = z.object({
  MaMuon: z.string().optional(),
  MaDocGia: z.string().min(1, {message: " Độc giả không được để trống"}),
  MaSach: z.string().min(1, {message: "Sách không được để trống"}),
  NgayMuon: z.coerce.date().optional(),
  NgayTra: z.coerce.date().optional(),
});

export type MuonSach = z.infer<typeof MuonSachSchema>;
