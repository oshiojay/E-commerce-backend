import {Request, Response} from "express"
import { JwtPayload } from "jsonwebtoken"
import prisma from "../config/prisma"
import cloudinary from "../middleware/cloudinary"
import fs from "fs/promises"
import { Category } from "@prisma/client"

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
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ 
      products,
      count: products.length
     });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ 
      error: "Something went wrong" 
    });
  }
};


export const getAllForAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as JwtPayload).id;

    if (!adminId) {
      return res.status(400).json({ 
        error: "admin not found" 
      });
    }

    const products = await prisma.product.findMany({
      where: { adminId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};


export const getProductByCategory = async (req: Request, res: Response) => {
    try {
        const category = req.params.category as string;
        const userId = (req.user as JwtPayload).id
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const products = await prisma.product.findMany({
            where: { category: category as Category},
            orderBy: { createdAt: "desc"}
            });

        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found in this category"
            });
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        console.log("Error fetching products:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const productId = req.query.productId as string;
    const userId = (req.user as JwtPayload).id

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user){
      return res.status(404).json({
        error: "User not found"
      })
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if(!product){
      return res.status(404).json({
        error: "Product not found"
      })
    }

    res.status(200).json({
      message: "Gotten one product successfully",
      product
    })
  } catch (error) {
      console.log("Error fetching products:", error);

      return res.status(500).json({
            message: "Internal server error"
        });
  }
}


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;
    const adminId = (req.user as JwtPayload).id

    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId
      }
    })

    if(!admin){
      return res.status(404).json({
        error: "Admin not found"
      })
    }

    const {productTitle, category, description, quantity, colour, price} = req.body

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        productTitle,
        category,
        description,
        quantity,
        colour,
        price
      }
    })

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct
    })
  } catch (error) {
    console.log("Error fetching products:", error);

      return res.status(500).json({
            message: "Internal server error"
        });
  }
}