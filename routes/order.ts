import {Router} from "express";
import { createOrder } from "../controller/order";
import { authenticateToken, userAuth } from "../middleware/auth";


const router = Router()

router.post("/create", authenticateToken, userAuth, createOrder)

export default router