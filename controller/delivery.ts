import {Request, Response} from "express";
import prisma from "../config/prisma"
import { JwtPayload } from "jsonwebtoken"


export const createDelivery = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as JwtPayload).id;
        const orderId = req.params.orderId as  string 

        const { fullName, streetAddress, phoneNumber, region, area} = req.body

        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user){
            return res.status(401).json({
                error: "Authentication failed"
            })
        }

        const order = await prisma.order.findUnique({
            where: {id: orderId},
            include: { items: true }
        })

        if(!order){
            return res.status(404).json({
                error: "Order not found"
            })
        }

        if(order.userId !== userId){
            return res.status(403).json({
                error: "You can only create delivery for your own orders"
            })
        }

        const fee = 0

        const delivery = await prisma.delivery.create({
            data: {
                orderId,
                fullName,
                streetAddress,
                phoneNumber,
                region,
                area,
                fee
            } 
        });

        res.status(201).json({
            message: "Delivery created successfully",
            delivery
        });
    } catch (error) {
        console.error("Error creating delivery:", error);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
}