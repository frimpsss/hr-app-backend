import { Request, Response } from "express";
import { employee } from "../../services/validator.service";
import { IAdmin, IReq, Role, HttpStatusCode } from "../../utils/@types";
import { IEmployee, EmployeeStatus } from "../../utils/@types";
import { z } from "zod";
import { compare, hashPassword } from "../../services/encryption.service";
import { createToken } from "../../services/auth.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export async function register(req: IReq, res: Response) {
  try {
    const {
      firstname,
      lastname,
      email,
      departmentId,
      password,
      role,
      gender,
      salary,
      contact
    }: IEmployee = req.body;
    employee.parse({
      email,
      firstname,
      lastname,
      departmentId,
      managerId: req.userId,
      password,
      role,
      gender,
      salary,
      contact
    });
    if (!req.userId) {
      return;
    }
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Only managers can create employees",
      });
    }
    const foundUser = await prisma.employee.findUnique({
      where: {
        email: email,
      },
    });

    if (foundUser) {
      return res.status(409).send({
        status: false,
        message: "user exists already",
      });
    }

    const pwd = await hashPassword(password);
    const created = await prisma.employee.create({
      data: {
        email,
        firstname: firstname,
        lastname,
        managerId: req.userId,
        departmentId,
        status: EmployeeStatus.active,
        password: pwd,
        role,
        gender,
        salary: salary as number,
        contact
      },
    });

    res.status(201).send({
      status: true,
      message: "Employee created succesfully",
      data: created,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.send({
        status: false,
        message: "validation error",
        data: error.errors,
      });
    }
    res.status(500).send({
      status: false,
      message: error,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password }: IAdmin = req.body;
    const foundUser = await prisma.employee.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      return res.status(404).send({
        status: false,
        message: "Email or password incorrect",
      });
    }

    const match = await compare(password, foundUser.password);
    if (!match) {
      return res.status(404).send({
        status: false,
        message: "Email or password incorrect",
      });
    }

    const token = await createToken({
      id: foundUser.id,
      role: Role.Employee,
    });

    res.status(200).send({
      status: true,
      message: "Log in successful",
      token,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.send({
        status: false,
        message: "validation error",
        data: error.errors,
      });
    }
    res.status(500).send({
      status: false,
      message: error,
    });
  }
}
