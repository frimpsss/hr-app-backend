import express, { Router } from "express";
import { create, allDepartment } from "../controller/department/department.controller";

const router: Router = express.Router();
router.get('/all', allDepartment)
router.post("/create", create);

export default router
