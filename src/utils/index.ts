import { prisma } from "../../prisma";
import { EmployeeStatus, LeaveStatus } from "./@types";
export function getDaysBetweenDates(date1: Date, date2: Date): number {
  if (date1.getTime() === date2.getTime()) {
    throw new Error("The two dates are the same.");
  }
  const timeDifferenceMs = Math.abs(date2.getTime() - date1.getTime());

  const daysDifference = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));

  return daysDifference;
}

export async function updateEmployeeStatus(managerId: string) {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        manager: {
          id: managerId,
        },
      },
      include: {
        leaves: {
          where: {
            status: LeaveStatus.approved,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        },
      },
    });

    for (const employee of employees) {
      if (employee.leaves.length > 0) {
        await prisma.employee.update({
          where: { id: employee.id },
          data: { status: EmployeeStatus.onLeave },
        });
        console.log(employee);
      } else {
        await prisma.employee.update({
          where: { id: employee.id },
          data: { status: EmployeeStatus.active },
        });
      }
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export function areDatesInRange(
  startDate1: Date,
  endDate1: Date,
  startDate2: Date,
  endDate2: Date
): boolean {
  return startDate1 <= endDate2 && endDate1 >= startDate2;
}
