import { Response, Request } from "express";
import { prisma } from "../../../prisma";
import { department } from "../../services/validator.service";
import { IReq } from "../../utils/@types";
import { z } from "zod";
export async function create(req: IReq, res: Response) {
  try {
    const { name } = req.body;
    if (!req.userId) {
      return;
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
