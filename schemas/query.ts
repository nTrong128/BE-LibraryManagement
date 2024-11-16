import {z} from "zod";

export const createQuerySchema = (allowedFields: readonly string[]) => {
  return z.object({
    page: z
      .string()
      .optional()
      .refine((val) => !isNaN(Number(val)), {
        message: "Trang phải là số nguyên",
      })
      .transform(Number)
      .optional(),
    pageSize: z
      .string()
      .optional()
      .refine((val) => !isNaN(Number(val)), {
        message: "Kích thước trang phải là số nguyên",
      })
      .default("5")
      .transform(Number),
    sortBy: z.enum(allowedFields as [string, ...string[]]).default(allowedFields[0]),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    search: z.string().optional(),
    searchBy: z.string().optional(),
  });
};
