import express, { Router } from "express";
import { allEmployees, singleEmployee, deleteEmployee , adminEditEmployeesInfo, employeeEditInfo} from "../controller/employee/employee.management.controller";
const router:Router = express.Router()

router.get('/all', allEmployees)
router.get('/employee', singleEmployee)
router.patch('/left', deleteEmployee)
router.patch('/admin/edit', adminEditEmployeesInfo )
router.patch('/employee/edit', employeeEditInfo)

export default router