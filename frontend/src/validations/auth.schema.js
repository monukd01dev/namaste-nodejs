import { z } from 'zod'; 

export const loginSchema = z.object({
    email: z
        .string().min(1,'Reguired')
        .trim()
        .toLowerCase()
        .email({ message: "Invalid format" })
        .max(255, { message: "Email is too long" }),

    password: z
        .string().min(1,'Reguired')
        .trim()
        .min(8, { message: 'At least 8 characters' })
        .max(50, { message: 'Max 50 characters' })
});

