import express, {Router} from 'express'
import { register } from '../controller/admin/admin.auth.controller'
const router:Router = express.Router()

router.post('/register', register)
router.post('/login', ) 


export default router