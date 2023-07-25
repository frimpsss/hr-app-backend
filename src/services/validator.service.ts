import { z } from "zod";
import { LeaveType } from "../utils/@types";
export const admin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyCapacity: z.number(),
});
export const adminLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const employee = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  departmentId: z.string(),
  managerId: z.string(),
  password: z.string(),
  role: z.string(),
  gender: z.string(),
  salary: z.number(),
  contact: z.string(),
});

export const department = z.object({
  name: z.string(),
  managerId: z.string(),
});

export const leave = z.object({
  reason: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  leaveType: z.nativeEnum(LeaveType),
});

export const adminEdit = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  contact: z.string(),
  departmentId: z.string(),
  role: z.string(),
  salary: z.number()
})

export const employeeEdit = z.object({
  oldPassword: z.string(),
  password: z.string()
})