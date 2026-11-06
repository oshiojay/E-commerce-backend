import {Router} from "express"
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controller/cart"
import { authenticateToken, userAuth } from "../middleware/auth"
import {
    addToCartValidation,
    cartItemIdValidation,
    cartProductIdValidation,
    updateCartItemValidation
} from "../middleware/validation"


const router = Router()

router.post("/add/:productId", authenticateToken, userAuth, cartProductIdValidation, addToCartValidation, addToCart)

router.get("/get", authenticateToken, userAuth, getCart)

router.put("/update/:itemId", authenticateToken, userAuth, cartItemIdValidation, updateCartItemValidation, updateCartItem)

router.delete("/remove/:itemId", authenticateToken, userAuth, cartItemIdValidation, removeFromCart)

export default router