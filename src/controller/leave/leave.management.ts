import { Response } from "express";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import {
  HttpStatusCode,
  ILeave,
  IReq,
  Role,
  LeaveStatus,
} from "../../utils/@types";
import { prisma } from "../../../prisma";
import { z } from "zod";
import {
  areDatesInRange,
  getDaysBetweenDates,
  updateEmployeeStatus,
} from "../../utils";
import { leave } from "../../services/validator.service";

export async function requestLeave(req: IReq, res: Response) {
  try {
    if (!req.userId) {
      return;
    }
    const { reason, startDate, endDate, leaveType }: ILeave = req.body;
    const duration = getDaysBetweenDates(
      new Date(startDate),
      new Date(endDate)
    );

    leave.parse({
      reason,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      leaveType,
    });
    if (new Date().getTime() > new Date(startDate).getTime()) {
      return res.status(HttpStatusCode.BadRequest).send({
        status: false,
        message: "Past date",
      });
    }
    const user = await prisma.employee.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        leaves: true,
      },
    });
    let validDate: boolean = false

    if (!user) {
      return res.status(HttpStatusCode.NotFound).send({
        status: false,
        message: "User not found",
      });
    }
    for (const leave of user.leaves) {
      if (leave.status == LeaveStatus.approved) {
        validDate = areDatesInRange(
          new Date(leave.startDate),
          new Date(leave.endDate),
          new Date(startDate),
          new Date(endDate),
        );
        
        if(validDate){
          break
        }
      }
    }


    if (duration > user.leaveDaysRemaining) {
      return res.status(HttpStatusCode.BadRequest).send({
        status: false,
        message: "Leave days exxeeded",
      });
    }
    if (validDate) {
      return res.status(HttpStatusCode.BadRequest).send({
        status: false,
        message: "Already booked dates",
      });
    }
    const created = await prisma.leave.create({
      data: {
        employeeId: req.userId as string,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration,
        reviewed: false,
        status: LeaveStatus.pending,
        leaveType: leaveType,
      },
    });
    res.status(HttpStatusCode.Created).send({
      status: true,
      message: "Leave request created successfully",
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
    if (error as PrismaClientValidationError) {
      return res.status(HttpStatusCode.InternalServerError).send({
        status: false,
        message: "Validation Error",
      });
    }

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
    const { id, approved }: { id: string; approved: boolean } = req.body;

    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    await updateEmployeeStatus(req.userId);
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
    if (leave.reviewed) {
      return res.status(HttpStatusCode.AlreadyReported).send({
        status: false,
        message: "Already reviewed",
      });
    }
    leave.status =
      approved == true ? LeaveStatus.approved : LeaveStatus.rejected;
    leave.reviewed = true;
    if (approved) {
      const user = await prisma.employee.findUnique({
        where: {
          id: leave.employeeId,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.NotFound).send({
          status: false,
          message: "User not found",
        });
      }

      user.leaveDaysRemaining = user?.leaveDaysRemaining - leave.duration;
      await prisma.employee.update({
        where: {
          id: user.id,
        },
        data: user,
      });
    }
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
      include: {
        employee: true,
      },
    });

    res.status(HttpStatusCode.Ok).send({
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
        include: {
          employee: true,
        },
      });

      res.status(HttpStatusCode.Ok).send({
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

      res.status(HttpStatusCode.Ok).send({
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
