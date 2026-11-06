import {Request, Response} from "express"
import prisma from "../config/prisma"
import { JwtPayload } from "jsonwebtoken"


export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as JwtPayload).id
        const productId = req.params.productId as string;
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
        const product = await prisma.product.findUnique({
            where: {id: productId}
        })
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // how many of this product are already in the cart?
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    const {quantity} = req.body
    const newQuantity = (existing?.quantity ?? 0) + quantity;
    if (newQuantity > product.quantity) {
      return res.status(400).json({ 
        message: "Not enough quantity available" 
    });
    }

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: newQuantity },
      create: { cartId: cart.id, productId, quantity },
    });

    return res.status(201).json({ 
        message: "Added to cart", 
        item 
    });
    } catch (error) {
        console.error("Error creating user or sending OTP:", error);
        return res.status(500).json({
            error: "Something went wrong",
    });
    } 
}


export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as JwtPayload).id

        const cart = await prisma.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        const items = cart?.items || [];

        let subtotal = 0;
        let itemCount = 0;

        items.forEach((item) => {
            subtotal += item.product.price * item.quantity;
            itemCount += item.quantity;
        });

        return res.status(200).json({
            message: "Cart fetched successfully",
            items,
            subtotal,
            itemCount
        });

    } catch (error) {
        console.log("Error fetching cart:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const  itemId  = req.params.itemId as string;
        const quantity = Number(req.body.quantity);
        const userId = (req.user as JwtPayload).id

        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }

        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: userId
                }
            },
            include: {
                product: true
            }
        });

        if (!item) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        if (quantity === 0) {
            await prisma.cartItem.delete({
                where: {
                    id: item.id
                }
            });

            return res.status(200).json({
                message: "Item removed from cart successfully"
            });
        }

        if (quantity > item.product.quantity) {
            return res.status(400).json({
                message: `Only ${item.product.quantity} items available in stock`
            });
        }

        const updated = await prisma.cartItem.update({
            where: {
                id: item.id
            },
            data: {
                quantity: quantity
            }
        });

        return res.status(200).json({
            message: "Cart updated successfully",
            item: updated
        });

    } catch (error) {
        console.log("Error updating cart:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const  itemId  = req.params.itemId as string;
        const userId = (req.user as JwtPayload).id;

        const result = await prisma.cartItem.deleteMany({
            where: {
                id: itemId,
                cart: {
                    userId: userId
                }
            }
        });

        if (result.count === 0) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        return res.status(200).json({
            message: "Item removed from cart successfully"
        });

    } catch (error) {
        console.log("Error removing item:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};