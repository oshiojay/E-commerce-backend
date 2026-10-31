import {Router} from "express"
import {createAdmin} from "../controller/admin"


const router = Router()

router.post('/create', createAdmin)

export default router