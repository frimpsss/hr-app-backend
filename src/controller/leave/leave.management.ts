import { Request, Response } from "express";
import {
  HttpStatusCode,
  ILeave,
  IReq,
  Role,
  LeaveStatus,
} from "../../utils/@types";
import { prisma } from "../../../prisma";
export async function requestLeave(req: IReq, res: Response) {
  try {
    if (!req.userId) {
      return;
    }
    const { reason, startDate, endDate }: ILeave = req.body;
    const duration = getDaysBetweenDates(startDate, endDate);
    const created = await prisma.leave.create({
      data: {
        employeeId: req.userId,
        reason,
        startDate,
        endDate,
        duration,
        reviewed: false,
        status: LeaveStatus.pending,
      },
    });
    res.status(HttpStatusCode.Created).send({
      status: true,
      message: "Leave request created successfully",
      data: created,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).send({
      status: false,
      message: error,
    });
  }
}

export async function manageLeave(req: IReq, res: Response) {
  try {
    if (!req.userId) {
      return;
    }
    const { id, approve }: { id: string; approve: boolean } = req.body;

    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    const leave = await prisma.leave.findFirst({
      where: {
        id: id as string,
        employee: {
          managerId: req.userId,
        },
      },
    });
    if (!leave) {
      return res.status(HttpStatusCode.NotFound).send({
        status: false,
        message: "Leave not found",
      });
    }
    leave.status = approve ? LeaveStatus.approved : LeaveStatus.rejected;
    leave.reviewed = true;
    const update = await prisma.leave.update({
      where: {
        id: leave.id,
      },
      data: leave,
    });

    res.status(HttpStatusCode.Ok).send({
      status: true,
      message: "Leave reviewd succesfully",
      data: update,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).send({
      status: false,
      message: error,
    });
  }
}

export async function allLeaves(req: IReq, res: Response) {
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

    const leaves = await prisma.leave.findMany({
      where: {
        employee: {
          managerId: req.userId,
        },
      },
    });

    res.send(HttpStatusCode.Ok).send({
      status: true,
      message: "leaves retrieved succesfully",
      data: leaves,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).send({
      status: false,
      message: error,
    });
  }
}

export async function userLeaveHistory(req: IReq, res: Response) {
  try {
    if (!req.userId) {
      return;
    }
    if (req.role == Role.Manager) {
      const employeeId = req.query["id"];

      const leaves = await prisma.leave.findMany({
        where: {
          employee: {
            managerId: req.userId,
          },
          employeeId: employeeId as string,
        },
      });

      res.send(HttpStatusCode.Ok).send({
        status: true,
        message: "leaves retrieved succesfully",
        data: leaves,
      });
    } else if (req.role == Role.Employee) {
      const leaves = await prisma.leave.findMany({
        where: {
          employeeId: req.userId as string,
        },
      });

      res.send(HttpStatusCode.Ok).send({
        status: true,
        message: "leaves retrieved succesfully",
        data: leaves,
      });
    }
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).send({
      status: false,
      message: error,
    });
  }
}
