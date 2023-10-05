import { Request, Response } from "express";
import { IAdmin, Role } from "../../utils/@types";
import { admin, adminLogin } from "../../services/validator.service";
import { z } from "zod";
import { hashPassword, compare } from "../../services/encryption.service";
import { createToken } from "../../services/auth.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export async function register(req: Request, res: Response) {
  try {
    
    const { email, password, companyCapacity }: IAdmin = req.body;
    await prisma.$connect()
    admin.parse({
      email,
      password,
      companyCapacity
    });

    const foundUser = await prisma.manager.findUnique({
      where: {
        email,
      },
    });

    if (foundUser) {
      return res.status(409).send({
        status: false,
        message: "Manager already exists.",
      });
    }
    const pwd = await hashPassword(password);

    const createdManager = await prisma.manager.create({
      data: {
        email,
        password: pwd,
        companyCapacity
      },
    });

    res.status(200).send({
      status: true,
      message: "Manager created",
      data: createdManager,
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

    adminLogin.parse({
      email,
      password,
    });

    const foundUser = await prisma.manager.findUnique({
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
      role: Role.Manager
    });
    res.status(200).send({
      status: true,
      message: "Log in succesfull",
      token,
    });
  } catch (error: any) {
    console.log(error);
    
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
