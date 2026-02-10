import {
  Gender,
  USER_ROLE,
  UserRole as UserRoleType,
} from "@pos/shared-models";
import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  mobile: z.string(),
  email: z
    .string()
    .email()
    .optional()
    .nullable()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  password: z.string(),
  DOB: z
    .union([
      z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date string format",
      }),
      z.date(),
    ])
    .optional()
    .nullable()
    .transform((val) =>
      typeof val === "string" ? new Date(val) : val ?? null,
    ),
  gender: z
    .number()
    .refine((val) => [1, 2, 3].includes(val), {
      message: "Gender must be one of 1, 2, or 3",
    })
    .transform((val) => val as Gender),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]) // only strings!
    .nullable(),
  maritalStatus: z
    .enum(["unmarried", "married", "devorced", "others"])
    .nullable(),
  religion: z
    .enum(["others", "islam", "hindu", "buddhism", "christianity"])
    .nullable(),
  role: z
    .number()
    .refine(
      (val) =>
        [
          USER_ROLE.VALUES.Admin,
          USER_ROLE.VALUES.Employee,
          USER_ROLE.VALUES.Vendor,
        ].includes(val),
      {
        message: "Role must be one of 1, 2, or 3",
      },
    )
    .transform((val) => val as UserRoleType), // Safe fallback
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial()
  // .extend({ isActive: z.boolean().optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateUserStatusSchema = z
  .object({
    isActive: z.boolean().optional(),
    // .transform((val) => val ?? null),
    isDeleted: z.boolean().optional(),
    // .transform((val) => val ?? null),
  })
  .refine(
    (data) =>
      (data.isActive !== undefined && data.isDeleted === undefined) ||
      (data.isActive === undefined && data.isDeleted !== undefined),
    {
      message: "Only one of 'isActive' or 'isDeleted' must be provided.",
      path: ["isActive"], // or leave empty to apply globally
    },
  );
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const updateOwnUserSchema = createUserSchema
  .omit({
    role: true,
    password: true,
    mobile: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateOwnUserInput = z.infer<typeof updateOwnUserSchema>;

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});
export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;

export const updatePasswordByAdminSchema = z.object({
  newPassword: z.string(),
});
export type updatePasswordByAdminInput = z.infer<
  typeof updatePasswordByAdminSchema
>;
