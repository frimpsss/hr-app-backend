import { Response } from "express";
import { EmployeeStatus, HttpStatusCode, IReq, Role } from "../../utils/@types";
import { prisma } from "../../../prisma";
import { adminEdit, employeeEdit } from "../../services/validator.service";
import { z } from "zod";
import { compare, hashPassword } from "../../services/encryption.service";
import { updateEmployeeStatus } from "../../utils";
export async function allEmployees(req: IReq, res: Response) {
  try {
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not a manager",
      });
    }
    await updateEmployeeStatus(req.userId as string);
    const employees = await prisma.employee.findMany({
      where: {
        managerId: req.userId as string,
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
    if (req.role == Role.Manager) {
      const id = req.query["id"];
      if (!id) {
        return res.status(400).send({
          status: false,
          message: "pass id",
        });
      }
      const employee = await prisma.employee.findUnique({
        where: {
          id: String(id),
        },
        include: {
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
        message: "Employee Retrieved Succesfully",
        data: employee,
      });
    } else if (req.role == Role.Employee) {
      const id = req.userId;
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
      res.status(200).send({
        status: true,
        message: "Employees Retrieved Succesfully",
        data: employee,
      });
    }
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
        id: id as string,
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
    const {
      firstname,
      lastname,
      salary,
      role,
      email,
      id,
      contact,
      departmentId,
    }: {
      firstname: string;
      lastname: string;
      salary: number;
      role: string;
      email: string;
      departmentId: string;
      contact: string;
      id: string;
    } = req.body;
    if (req.role !== Role.Manager) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Not an admin",
      });
    }

    adminEdit.parse({
      firstname,
      lastname,
      contact,
      email,
      departmentId,
      role,
      salary,
    });

    const found = await prisma.employee.findUnique({
      where: {
        id: id as string,
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
    found.departmentId = departmentId;
    found.contact = contact;

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

export async function employeeEditInfo(req: IReq, res: Response) {
  try {
    const { oldPassword, password } = req.body;
    if (req.role !== Role.Employee) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "Only employees can edit password",
      });
    }

    employeeEdit.parse({
      oldPassword,
      password,
    });

    const found = await prisma.employee.findUnique({
      where: {
        id: req.userId as string,
      },
    });

    if (!found) {
      return res.status(HttpStatusCode.NotFound).send({
        status: false,
        message: "User doesnt exist",
      });
    }
    const match = await compare(oldPassword, found.password);
    console.log(match);
    
    if (!match) {
      return res.status(HttpStatusCode.BadRequest).send({
        status: false,
        message: "Old password incorrect",
      });
    }

    const pwd = await hashPassword(password);
    found.password = pwd;
    await prisma.employee.update({
      where: {
        id: req.userId as string,
      },
      data: found,
    });

    res.status(HttpStatusCode.Ok).send({
      status: true,
      message: "Password changed",
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
        managerId: req.userId as string,
        status: EmployeeStatus.onLeave,
      },
    });

    totalactive = await prisma.employee.count({
      where: {
        managerId: req.userId as string,
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
