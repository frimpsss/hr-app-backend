import {z} from 'zod'

export const admin = z.object({
    email: z.string().email(), 
    password: z.string().min(8)
})

export const employee = z.object({
    email: z.string().email(),
    firstname: z.string(),
    lastname:  z.string(),
    departmentId: z.string(),
    managerId: z.string(),
    password: z.string(),
    role: z.string(),
    gender: z.string(), 
    salary: z.number()
})

export const department = z.object({
    name: z.string(), 
    managerId: z.string()
})