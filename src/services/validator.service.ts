import {z} from 'zod'

export const admin = z.object({
    email: z.string().email(), 
    password: z.string().min(8),
    companyCapacity: z.number()
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
    salary: z.number(),
    contact: z.string()
})

export const department = z.object({
    name: z.string(), 
    managerId: z.string()
})

export const leave = z.object({
    reason: z.string(),
    startDate: z.date(),
    endDate: z.date()
})