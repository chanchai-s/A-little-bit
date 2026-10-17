import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9,15}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(emailRegex, "Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    firstname: z.string().min(1, "Required"),
    lastname: z.string().min(1, "Required"),
    username: z.string().min(2, "Required"),
    email: z.string().min(1, "Required").regex(emailRegex, "Invalid email"),
    phone: z
      .string()
      .min(1, "Required")
      .regex(phoneRegex, "Invalid phone number"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["BUYER", "SELLER"], {
      message: "Please select a role",
    }),
    street: z.string().min(1, "Required"),
    label: z.string().min(1, "Required"),
    city: z.string().optional().or(z.literal("")),
    state: z.string().optional().or(z.literal("")),
    country: z.string().optional().or(z.literal("")),
    postalCode: z.string().optional().or(z.literal("")),
    agreed: z.literal(true, {
      message: "You must agree to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
