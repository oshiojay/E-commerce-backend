import {Request, Response} from "express"
import prisma from "../config/prisma"
import bcrypt from "bcrypt"
import otpGenerator from "otp-generator"
import {sendSingleEmail} from "../utils/brevo"
import {sendOTPEmail} from "../email"

interface OTPData {
  otp: string;
  otpExpire: Date;
}

export const generateOTP = (): OTPData => {
  return {
    otp: otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    }),

    otpExpire: new Date(Date.now() + 1000 * 60 * 5),
  };
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body
        const normalizedEmail = email.toLowerCase();
        const existingUser = await prisma.admin.findUnique({where: {email: normalizedEmail}})
        if(existingUser){
            return res.status(404).json({
                error: "invalid credentails"
            })
        }

        const hashed = await bcrypt.hash(password, 10)
        const {otp, otpExpire} = generateOTP()
        const newAdmin = await prisma.admin.create({
            data:{
                name,
                email: normalizedEmail,
                password: hashed,
                otp,
                otpExpire
            }
        })

         await sendSingleEmail({
              email: normalizedEmail,
              html: sendOTPEmail(name, otp),
              subject: "VERIFY OTP",
            });

        res.status(201).json({
            error: "Admin created successfully. Please check your email for verification",
      data: newAdmin,
        })
    } catch (error) {
    console.error("Error creating user or sending OTP:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
    }
}