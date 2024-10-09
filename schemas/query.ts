import {z} from "zod";

export const createQuerySchema = (allowedSortFields: readonly string[]) => {
  return z.object({
    page: z
      .string()
      .optional()
      .refine((val) => !isNaN(Number(val)), {
        message: "Page must be a number",
      })
      .transform(Number)
      .optional(),
    pageSize: z
      .string()
      .optional()
      .refine((val) => !isNaN(Number(val)), {
        message: "PageSize must be a number",
      })
      .default("5")
      .transform(Number),
    sortBy: z.enum(allowedSortFields as [string, ...string[]]).default(allowedSortFields[0]),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    search: z.string().optional(),
  });
};
