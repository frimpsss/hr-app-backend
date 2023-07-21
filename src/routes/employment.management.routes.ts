import express, { Router } from "express";
import { allEmployees, singleEmployee, deleteEmployee , adminEditEmployeesInfo, employeeEditInfo, getEmployeeStats} from "../controller/employee/employee.management.controller";
const router:Router = express.Router()

router.get('/all', allEmployees)
router.get('/employee', singleEmployee)
router.delete('/left', deleteEmployee)
router.patch('/admin/edit', adminEditEmployeesInfo )
router.patch('/employee/edit', employeeEditInfo)
router.get('/stats', getEmployeeStats)

export default router