import { z } from "zod";


export const registrationFormSchema = z.object({
    name: z.string().trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes.",
    }),
    email: z.string().trim().toLowerCase().email({
      message: "Invalid email address format.",
    }),
    password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]+/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]+/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]+/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9\s]+/, {
      message: "Password must contain at least one special character.",
    }),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export const agencyRegistrationFormSchema = z.object({
  agencyName: z.string().trim()
  .min(2, { message: "Agency Name must be at least 2 characters long." })
  .max(100, { message: "Agency Name cannot exceed 100 characters." }),
  agencyEmail: z.string().trim().toLowerCase().email({
    message: "Invalid agency email address format.",
  }),
  agencyAddress: z.string().trim()
  .min(5, { message: "Agency Address must be at least 5 characters long." })
  .max(200, { message: "Agency Address cannot exceed 200 characters." }),
  sirenNumber: z.string().trim()
  .length(9, { message: "SIREN Number must be exactly 9 characters long." })
  .regex(/^[0-9]+$/, { message: "SIREN Number must contain only digits." }),
})


export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Invalid email address format.",
  }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
})

export const resetPasswordSchema = z.object({
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." }),
    confrimPassword : z.string()
}).refine((data) => data.confrimPassword === data.password , {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export const forgetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Invalid email address format.",
  })
})



export const tenantRegistrationFormSchema = z.object({
  name: z.string().trim()
  .min(2, { message: "Name must be at least 2 characters long." })
  .max(50, { message: "Name cannot exceed 50 characters." })
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: "Name can only contain letters, spaces, hyphens, and apostrophes.",
  }),
  email: z.string().trim().toLowerCase().email({
    message: "Invalid email address format.",
  }),
  password: z.string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]+/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]+/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]+/, {
    message: "Password must contain at least one number.",
  })
  .regex(/[^a-zA-Z0-9\s]+/, {
    message: "Password must contain at least one special character.",
  }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export const emailValidation = z.object({
  email: z.string().trim().toLowerCase().email({
    message:"Invalid email address format.",
  })
})