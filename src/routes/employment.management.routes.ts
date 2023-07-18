import express, { Router } from "express";
import { allEmployees, singleEmployee, deleteEmployee , adminEditEmployeesInfo} from "../controller/employee/employee.management.controller";
const router:Router = express.Router()

router.get('/all', allEmployees)
router.get('/employee', singleEmployee)
router.patch('/left', deleteEmployee)
router.patch('/admin/edit', adminEditEmployeesInfo )

export default router