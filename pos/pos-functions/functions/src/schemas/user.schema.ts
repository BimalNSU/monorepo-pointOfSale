import { USER_ROLE } from "../constants/common";
import {
  Gender,
  MaritalStatus,
  Religion,
  UserRole as UserRoleType,
} from "@pos/shared-models";
import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z
    .string()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  mobile: z.string(),
  email: z
    .string()
    .email()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  age: z.number(),
  password: z.string(),
  DOB: z
    .date()
    .optional()
    .transform((val) => (typeof val === "undefined" ? null : val)),
  gender: z.number().refine((val) => [1, 2, 3].includes(val), {
    message: "Gender must be one of 1, 2, or 3",
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]), // only strings!
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
    .transform((val) => val as UserRoleType), // Safe fallback
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

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
    }
  );
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const updateUserSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    age: z.number().optional(),
    DOB: z.date().optional(),
    gender: z
      .number()
      .refine((val) => [1, 2, 3].includes(val), {
        message: "Gender must be one of 1, 2, or 3",
      })
      .optional()
      .transform((val) => val as Gender),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]) // only strings!
      .optional(),
    maritalStatus: z
      .enum(["unmarried", "married", "devorced", "others"])
      .optional()
      .transform((val) => val as MaritalStatus), // Safe fallback
    religion: z
      .enum(["islam", "hindu", "buddhism", "christianity", "others"])
      .optional()
      .transform((val) => val as Religion), // Safe fallback
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
      .transform((val) => val as UserRoleType), // Safe fallback
    // profileImage
    //   .refine((data) => data.isActive != undefined || data.isDeleted != undefined, {
    //     message: "At least one of 'isActive' or 'isDeleted' must be provided.",
    //     path: ["isActive"], // or leave empty to apply globally
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});
export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;
