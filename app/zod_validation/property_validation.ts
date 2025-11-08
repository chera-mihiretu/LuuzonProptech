import { z } from 'zod';

export const propertySchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required." }),
    description: z.string().trim().optional(),
    price: z.string().or(z.number()).or(z.undefined()).transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        if (typeof val === "string") {
            if (val === "") return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }
        return val;
    }).pipe(z.union([
        z.number().refine((val) => val >= 0, { message: "Price must clsbe a positive number." }),
        z.undefined()
    ])),
    currency: z.string().trim().min(1, { message: "Currency is required." }),
    status: z.enum(['listed', 'rented', 'archived']),
    address: z.string().trim().min(1, { message: "Address is required." }),
    city: z.string().trim().min(1, { message: "City is required." }),
    state: z.string().trim().min(1, { message: "State is required." }),
    country: z.string().trim().min(1, { message: "Country is required." }),
    longitude: z.string().or(z.number()).or(z.undefined()).transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        if (typeof val === "string") {
            if (val === "") return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }
        return val;
    }).pipe(z.number().min(-180).max(180).optional()),
    latitude: z.string().or(z.number()).or(z.undefined()).transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        if (typeof val === "string") {
            if (val === "") return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        }
        return val;
    }).pipe(z.number().min(-90).max(90).optional()),
    amenities: z.string().trim().optional(),
});
  