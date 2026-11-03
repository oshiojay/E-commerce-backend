import {Router} from "express"
import {createAdmin,resendOtp,login,verifyAdmin,forgotPassword,resetPassword,changePassword} from "../controller/admin"
import {createAdminValidation, verifyUserValidation, loginValidation, resendOtpValidation, forgotPasswordValidation, resetPasswordValidation, changePasswordValidation} from "../middleware/validation"
import { authenticateToken, adminAuth} from "../middleware/auth"


const router = Router()

router.post('/create', createAdminValidation, createAdmin)
router.post('/verify', verifyUserValidation, verifyAdmin)
router.post('/login', loginValidation, login)
router.post('/resend-otp', resendOtpValidation, resendOtp)


router.post('/forgot-password', forgotPasswordValidation, forgotPassword)
router.post('/reset-password', resetPasswordValidation, resetPassword)
router.post('/change-password', authenticateToken, adminAuth, changePasswordValidation, changePassword)

export default router