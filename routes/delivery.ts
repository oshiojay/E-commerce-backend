import Router from "express";
import { createDelivery } from "../controller/delivery";
import { authenticateToken, userAuth } from "../middleware/auth";

const router = Router()

router.post("/create/:orderId", authenticateToken, userAuth, createDelivery)

export default router