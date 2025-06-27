import { SHOP_ROLE, USER_ROLE } from "../constants/common";
import { ShopRole, UserRole } from "@pos/shared-models";
import { z } from "zod";

export const updateSessionSchema = z.object({
  role: z
    .number()
    .refine(
      (val) =>
        [
          USER_ROLE.VALUES.Admin,
          USER_ROLE.VALUES.Manager,
          USER_ROLE.VALUES.Salesman,
        ].includes(val),
      {
        message: "Role must be one of 1, 2, or 3",
      }
    )
    .transform((val) => val as UserRole), // Safe fallback
  shopId: z.string().optional(),
  shopRole: z
    .number()
    .refine(
      (val) =>
        [
          SHOP_ROLE.VALUES.Manager,
          SHOP_ROLE.VALUES.Cashier,
          SHOP_ROLE.VALUES.Salesman,
        ].includes(val),
      {
        message: "Role must be one of 1, 2, or 3",
      }
    )
    .optional()
    .transform((val) => val as ShopRole), // Safe fallback
});
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
