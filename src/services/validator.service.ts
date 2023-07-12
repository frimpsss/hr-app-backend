import {z} from 'zod'

export const admin = z.object({
    email: z.string().email(), 
    password: z.string().min(8)
})