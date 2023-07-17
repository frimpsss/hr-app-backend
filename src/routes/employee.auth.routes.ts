import express, {Router} from "express"
import { register, login } from "../controller/employee/employee.auth.controller"
import { verify } from "../middleware/verify.middleware"
const router:Router = express.Router()

router.post('/register', verify,  register )
router.post('/login',login )

export default router