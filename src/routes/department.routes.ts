import express, { Router } from "express";
import { create } from "../controller/department/department.controller";

const router: Router = express.Router();

router.post("/create", create);

export default router
