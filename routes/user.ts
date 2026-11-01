import {Router} from "express"
import {createUser, verifyUser, login, resendOtp, forgotPassword, resetPassword, changePassword} from "../controller/user"
import {clientReg, verifyUserValidation, loginValidation, resendOtpValidation, forgotPasswordValidation, resetPasswordValidation, changePasswordValidation} from "../middleware/validation"
import { authenticateToken,  userAuth} from "../middleware/auth"

const router = Router()

router.post('/create', clientReg, createUser)
router.post('/verify', verifyUserValidation, verifyUser)
router.post('/login', loginValidation, login)
router.post('/resend', resendOtpValidation, resendOtp)

router.post('/forgot-password', forgotPasswordValidation, forgotPassword)
router.post('/reset-password', resetPasswordValidation, resetPassword)
router.post('/change-password', authenticateToken, changePasswordValidation, changePassword)

export default router