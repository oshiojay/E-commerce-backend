import {Request, Response} from "express"
import { JwtPayload } from "jsonwebtoken"
import prisma from "../config/prisma"
import cloudinary from "../middleware/cloudinary"
import fs from "fs/promises"

export const createProduct = async (req: Request, res: Response) => {
    const filePath = req.file?.path;
    try {
        const adminId = (req.user as JwtPayload).id

        const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return res.status(404).json({ 
        message: "Admin not found" 
    });
      
    }

    if (!filePath) {
      res.status(400).json({ message: "Product photo is required" });
      return;
    }

    const {productTitle, category, description, colour} = req.body

    const quantity = Number(req.body.quantity);
    const price = Number(req.body.price);
    
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder: "assets",
    });

    await fs.unlink(filePath);

    const product = await prisma.product.create({
      data: {
        productTitle,
        category,
        description,
        quantity,
        colour,
        price,
        productPhoto: uploaded.secure_url,
        adminId,
      },
    });

    res.status(201).json({
        message: "Product created successfully",
        product
    })
        
    } catch (error) {
        console.error("Error creating user or sending OTP:", error);
        return res.status(500).json({
            error: "Something went wrong",
    });
    }
}