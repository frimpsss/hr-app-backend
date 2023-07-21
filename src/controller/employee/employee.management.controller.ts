import { Request, Response } from "express";
import { EmployeeStatus, HttpStatusCode, IReq, Role } from "../../utils/@types";
import { prisma } from "../../../prisma";
import { admin } from "../../services/validator.service";
import { z } from "zod";
import { hashPassword } from "../../services/encryption.service";
export async function allEmployees(req: IReq, res: Response) {
  try {
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    const employees = await prisma.employee.findMany({
      where: {
        managerId: String(req.userId),
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).send({
      status: true,
      message: "Employees Retrieved Succesfully",
      data: employees,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error,
    });
  }
}

export async function singleEmployee(req: IReq, res: Response) {
  try {
    const id = req.query["id"];
    if (!id) {
      return res.status(400).send({
        status: false,
        message: "pass id",
      });
    }
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: {
        id: String(id),
      },
      select: {
        email: true,
        firstname: true,
        lastname: true,
        department: true,
      },
    });
    if (!employee) {
      return res.status(404).send({
        status: false,
        message: "Employee not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Employees Retrieved Succesfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error,
    });
  }
}

export async function deleteEmployee(req: IReq, res: Response) {
  try {
    const id = req.query["id"];
    if (!id) {
      return res.status(400).send({
        status: false,
        message: "pass id",
      });
    }
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: {
        id: String(id),
      },
    });
    if (!employee) {
      return res.status(404).send({
        status: false,
        message: "Employee not found",
      });
    }
    await prisma.employee.delete({
      where: {
        id: employee.id,
      },
    });

    res.status(200).send({
      status: true,
      message: "Deleted succesfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error,
    });
  }
}

export async function adminEditEmployeesInfo(req: IReq, res: Response) {
  try {
    const { firstname, lastname, salary, role, email, id } = req.body;
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not an admin",
      });
    }

    const found = await prisma.employee.findUnique({
      where: {
        id,
      },
    });
    if (!found) {
      return res.status(HttpStatusCode.NotFound).send({
        status: false,
        message: "Employee not found",
      });
    }

    found.firstname = firstname;
    found.lastname = lastname;
    found.salary = salary;
    found.role = role;
    found.email = email;

    const update = await prisma.employee.update({
      where: {
        id: found.id,
      },
      data: found,
    });

    res.status(HttpStatusCode.Ok).send({
      status: true,
      message: "Employee record updated succesfully",
      data: update,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error,
    });
  }
}

export async function employeeEditInfo(req: IReq, res: Response) {
  try {
    const { email, password } = req.body;
    if (req.role !== Role.Employee) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Only employees can edit password",
      });
    }

    admin.parse({
      email,
      password,
    });

    const found = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (!found) {
      return res.status(HttpStatusCode.NotFound).send({
        status: false,
        message: "User doesnt exist",
      });
    }
    const pwd = await hashPassword(password);
    found.password = pwd;
    await prisma.employee.update({
      where: {
        email,
      },
      data: found,
    });

    res.status(HttpStatusCode.Ok).send({
      status: true,
      message: "Password created",
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

export async function getEmployeeStats(req: IReq, res: Response) {
  try {
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }

    let totalnumber: number;
    let totalonleave: number;
    let totalactive: number;
    let companycapacity: number | null | undefined;

    totalnumber = await prisma.employee.count({
      where: {
        managerId: req.userId as string,
      },
    });

    totalonleave = await prisma.employee.count({
      where: {
        id: req.userId as string,
        status: EmployeeStatus.onLeave,
      },
    });

    totalactive = await prisma.employee.count({
      where: {
        id: req.userId as string,
        status: EmployeeStatus.active,
      },
    });
    const found = await prisma.manager.findUnique({
      where: {
        id: req.userId,
      },
    });
    companycapacity = found?.companyCapacity;

    res.status(HttpStatusCode.Ok).send({
      status: true,
      data: {
        totalactive,
        totalonleave,
        totalnumber,
        companycapacity,
      },
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).send({
      status: false,
      message: error,
    });
  }
}
