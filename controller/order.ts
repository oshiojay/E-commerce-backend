import {Request, Response} from "express";
import prisma from "../config/prisma"
import { JwtPayload } from "jsonwebtoken"

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as JwtPayload).id;
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user){
            return res.status(401).json({
                error: "Authentication failed"
            })
        }

        const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          error: "Cart is empty"
        });
      }

      for (const item of cart.items) {
        if (item.quantity > item.product.quantity) {
          return res.status(400).json({
            error: `OUT_OF_STOCK:${item.product.productTitle}`
          });
        }
    }

    const subtotal = cart.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );
      const tax = Math.round(subtotal * 0.072); 
      const total = subtotal + tax;

      const created = await prisma.order.create({
        data: {
          userId,
          subtotal,
          tax,
          total,
          items: {
            create: cart.items.map((i) => ({
              productId: i.productId,
              adminId: i.product.adminId,
              productTitle: i.product.productTitle,
              unitPrice: i.product.price,
              quantity: i.quantity,
            })),
          },
        },
        include: { items: true },
      });


      res.status(201).json({
        message: "Order created successfully",
        order: created,
      })

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
}