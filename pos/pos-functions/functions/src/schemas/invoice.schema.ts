import { z } from "zod";

export const createInvoiceSchema = z.object({
  id: z.string(),
  items: z.array(
    z.object({
      id: z.string(), //productId
      qty: z.number(),
      discount: z.number().nullable(),
    })
  ),
  discount: z
    .number()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  subject: z
    .string()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  reference: z
    .string()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),

  deposits: z
    .array(
      z.object({
        id: z.string(),
        amount: z.number(),
      })
    )
    .optional(), // this allows it to be undefined

  targetUserId: z
    .string()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  customerName: z.string().nullable(),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
