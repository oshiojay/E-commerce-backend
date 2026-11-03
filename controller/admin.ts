import {Request, Response} from "express"
import prisma from "../config/prisma"
import bcrypt from "bcrypt"
import otpGenerator from "otp-generator"
import {sendSingleEmail} from "../utils/brevo"
import {sendOTPEmail} from "../email"
import jwt from "jsonwebtoken"

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

export const verifyAdmin = async (req: Request, res: Response) => {
  try{
    const {email, otp} = req.body
    const normalizedEmail = email.toLowerCase()
    const user = await prisma.admin.findUnique({where: {email: normalizedEmail}})
    if(!user){
      return res.status(404).json({
        error: "Invalid credentails"
      })
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        error: "No valid OTP found. Please request a new one.",
      });
    }

    if (Date.now() > user.otpExpire.getTime()) {
      return res.status(400).json({
        error: "OTP has expired. Please request a new one.",
      });
    }

    if (user.otp !== String(otp)) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        otp: null,
        otpExpire: null,
      },
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });

  }catch(error){
    console.error("Error creating user or sending OTP:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const user = await prisma.admin.findUnique({where: {email: email.toLowerCase()}})

        if(!user){
            return res.status(404).json({
                message: "Invalid credentials"
            })
        }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    if (user.isVerified == false) {
      return res.status(400).json({
        message: 'Please verify your email'
      })
    };

    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error("SECRET_KEY is not configured");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secretKey,
      {
        expiresIn: "1d",
      }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    const data = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
    }

    res.status(200).json({
        error: "Login successful",
        data
    })

    } catch (error) {
      console.error("Error creating user or sending OTP:", error);
      return res.status(500).json({
       error: "Something went wrong",
      });
    }
}


export const resendOtp = async (req: Request, res: Response) => {
  try {
    const {email} = req.body
    const normalizedEmail = email.toLowerCase();
    const user = await prisma.admin.findUnique({where: {email: normalizedEmail}})

    if(!user){
      return res.status(404).json({
        error: "User not found"
      })
    }

    const {otp, otpExpire} = generateOTP()

    await prisma.admin.update({
      where: {
        id: user.id
      },
      data:{
        otp,
        otpExpire
      }
    })

    await sendSingleEmail({
      email: normalizedEmail,
      html: sendOTPEmail(user.name, otp),
      subject: "RESEND: VERIFY OTP",
    });

    res.status(200).json({
      error: "OTP resent successfully. Please check your email for verification"
    })
  } catch (error) {
    console.error("Error creating user or sending OTP:", error);
      return res.status(500).json({
       error: "Something went wrong",
      });
  }
}


export const forgotPassword = async (req: Request, res: Response) => {
  try{
    const {email} = req.body
    const normalizedEmail = email.toLowerCase()
    const user = await prisma.admin.findUnique({where: {email: normalizedEmail}})
    if(!user){
      return res.status(404).json({
        error: "User not found"
      })
    }

    const {otp, otpExpire} = generateOTP()

    await prisma.admin.update({
      where: {
        id: user.id,
      },
      data: {
        otp,
        otpExpire,
      },
    });

    await sendSingleEmail({
      email: normalizedEmail,
      html: sendOTPEmail(user.name, otp),
      subject: "FORGOT PASSWORD: VERIFY OTP",
    });

    res.status(200).json({
      error: "Forgotten password successful. Please check your email for OTP."
    })

  }catch(error){
      console.error("Error creating user or sending OTP:", error);
      return res.status(500).json({
       error: "Something went wrong",
      });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try{
    const {email, password} = req.body
    const normalizedEmail = email.toLowerCase()
    const user = await prisma.admin.findUnique({where: {email: normalizedEmail}})
    if(!user){
      return res.status(404).json({
        error: "User not found"
      })
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.admin.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashed,
        otp: null,
        otpExpire: null,
      },
    });

    res.status(200).json({
      error: "Password reset successful. You can now log in with your new password."
    })
  }catch(error){
    console.error("Error creating user or sending OTP:", error);
      return res.status(500).json({
       error: "Something went wrong",
      });
  }
}


export const changePassword = async (req: Request, res: Response) => {
  try {
    if(!req.user || !req.user.id) {
      return res.status(401).json({
        error: 'Unauthorized - Invalid token'
      })
    }
    const {oldPassword, newPassword} = req.body
    const user = await prisma.admin.findUnique({
      where: { id: req.user.id },
    });
    if(!user){
      return res.status(404).json({
        message: "User not found"
      })
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Old password is invalid"
      })
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    await prisma.admin.update({
      where:{
        id: user.id
      },
      data: {
        password: hashed
      },
    })

    res.status(200).json({
      error: "Password changed successfully"
    })
  } catch (error) {
    console.error("Error creating user or sending OTP:", error);
      return res.status(500).json({
       error: "Something went wrong",
      });
  }
}
