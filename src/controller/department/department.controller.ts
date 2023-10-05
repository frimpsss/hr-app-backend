import { Response, Request } from "express";
import { department } from "../../services/validator.service";
import { HttpStatusCode, IReq, Role } from "../../utils/@types";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export async function create(req: IReq, res: Response) {
  try {
    const { name } = req.body;
    if (!req.userId) {
      return;
    }
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    department.parse({
      name,
      managerId: req.userId,
    });

    const created = await prisma.department.create({
      data: {
        name,
        managerId: req.userId,
      },
    });

    res.status(201).send({
      status: true,
      message: "Department created succesfully",
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

export async function allDepartment(req: IReq, res: Response) {
  try {
    if (!req.userId) {
      return;
    }
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    const departments = await prisma.department.findMany({
      where: {
        managerId: req.userId,
      },
    });
    res.status(HttpStatusCode.Ok).send({
      status: true,
      message: "Department retrieved successfully",
      data: departments,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error,
    });
  }
}
