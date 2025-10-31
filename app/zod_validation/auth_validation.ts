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

export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Invalid email address format.",
  }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
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
