import { ShopRole } from "@pos/shared-models";
import { z } from "zod";

export const createShopAccessSchema = z.object({
  shopRole: z
    .number()
    .refine((val) => [1, 2, 3].includes(val), {
      message: "Shop role must be one of 1, 2, or 3",
    })
    .transform((val) => val as ShopRole),
});
