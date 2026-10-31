import {Router} from "express"
import {createUser, verifyUser, login, resendOtp} from "../controller/user"
import {clientReg, verifyUserValidation, loginValidation, resendOtpValidation} from "../middleware/validation"

const router = Router()

router.post('/create', clientReg, createUser)
router.post('/verify', verifyUserValidation, verifyUser)
router.post('/login', loginValidation, login)
router.post('/resend', resendOtpValidation, resendOtp)

export default router