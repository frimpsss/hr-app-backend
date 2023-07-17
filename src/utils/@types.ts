import { Request } from "express";
export interface IAdmin {
  email: string;
  password: string;
  id?: string;
}

export interface IEmployee{
  email: string
  password: string
  departmentId : string, 
  managerId: string
  firstname: string
  lastname: string,
}

export interface IReq extends Request {
  userId?: string;
}

export enum EmployeeStatus{
  active='Active',
  left= 'Left',
  onLeave ='Leave'
}

export interface tokenPayload {
  id: string
}