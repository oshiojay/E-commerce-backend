import {Request, Response} from "express"
import prisma from "../config/prisma"
import bcrypt from "bcrypt"
import {sendSingleEmail} from "../utils/brevo"
import otpGenerator from "otp-generator"
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(404).json({
        error: "Invalid credentails",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { otp, otpExpire } = generateOTP();
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email: normalizedEmail,
        password: hashed,
        otp,
        otpExpire,
      },
    });

    await sendSingleEmail({
      email: normalizedEmail,
      html: sendOTPEmail(fullName, otp),
      subject: "VERIFY OTP",
    });

    return res.status(201).json({
      error: "User created successfully. Please check your email for verification",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user or sending OTP:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}