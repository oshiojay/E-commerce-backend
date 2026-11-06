import {Request, Response} from "express"
import { JwtPayload } from "jsonwebtoken"
import prisma from "../config/prisma"
import cloudinary from "../middleware/cloudinary"
import fs from "fs/promises"

export const createProduct = async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
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

    if (files.length === 0) {
  res.status(400).json({ message: "At least one product photo is required" });
  return;
}

    const {productTitle, category, description, colour} = req.body

    const quantity = Number(req.body.quantity);
    const price = Number(req.body.price);
    
    const uploads = await Promise.all(
  files.map((file) =>
    cloudinary.uploader.upload(file.path, { folder: "assets" })
  )
);
const photoUrls = uploads.map((u) => u.secure_url);

    const product = await prisma.product.create({
      data: {
        productTitle,
        category,
        description,
        quantity,
        colour,
        price,
        productPhoto: photoUrls,
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
    } finally {
  await Promise.all(
    files.map((file) =>
      fs.unlink(file.path).catch((err) =>
        console.error("Could not delete temp file:", file.path, err)
      )
    )
  );
}
}


export const getAllForUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as JwtPayload).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};