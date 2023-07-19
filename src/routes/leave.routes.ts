import express, { Router } from "express";
import { allLeaves, manageLeave, requestLeave, userLeaveHistory} from "../controller/leave/leave.management";
const router:Router = express.Router()


router.post('/request', requestLeave)
router.get('/all', allLeaves)
router.patch('/manage', manageLeave)
router.get('/history', userLeaveHistory)



export default router