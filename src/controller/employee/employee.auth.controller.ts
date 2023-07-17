import { Request, Response } from "express";
import { employee } from "../../services/validator.service";
import { IAdmin, IReq } from "../../utils/@types";
import { prisma } from "../../../prisma";
import { IEmployee, EmployeeStatus } from "../../utils/@types";
import { z } from "zod";
import { compare, hashPassword } from "../../services/encryption.service";
import { createToken } from "../../services/auth.service";
export async function register(req: IReq, res: Response) {
  try {
    const { firstname, lastname, email, departmentId, password }: IEmployee =
      req.body;
    employee.parse({
      email,
      firstname,
      lastname,
      departmentId,
      managerId: req.userId,
      password,
    });
    if (!req.userId) {
      return;
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
    const pwd = await password;
    const created = await prisma.employee.create({
      data: {
        email,
        firstname: firstname,
        lastname,
        managerId: req.userId,
        departmentId,
        status: EmployeeStatus.active,
        password: pwd,
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

    const match = compare(password, foundUser.password);
    if (!match) {
      return res.status(404).send({
        status: false,
        message: "Email or password incorrect",
      });
    }

    const token = await createToken(foundUser.id);

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
