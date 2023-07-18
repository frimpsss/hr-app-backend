import { Request, Response } from "express";
import { EmployeeStatus, HttpStatusCode, IReq, Role } from "../../utils/@types";
import { prisma } from "../../../prisma";
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
    employee.status = EmployeeStatus.left;

    await prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: employee,
    });

    res.status(200).send({
      status: true,
      message: "Status changed succesfully",
      data: employee,
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
