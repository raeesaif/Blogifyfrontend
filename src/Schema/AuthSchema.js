import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().min(1,"Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})


export const SignUpSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().min(1,"Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword:z.string().min(6, "Confirm Password must be at least 6 characters long"),
    role: z.enum(["reader", "writer"], {
        required_error: "Role is required",
        invalid_type_error: "Role is required",
    }),
}).refine((data)=>data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })
   


export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required" })
      .min(6, "Current password must be at least 6 characters long"),

    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "New password must be at least 6 characters long"),

    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });