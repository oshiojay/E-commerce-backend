import {Router} from "express";
import { createProduct, getAllForUser, getAllForAdmin, getProductByCategory, getOne, updateProduct } from "../controller/product";
import { authenticateToken, adminAuth, userAuth } from "../middleware/auth";
import { upload } from "../middleware/multer";
import { createProductValidation } from "../middleware/validation";

const router = Router()

router.post(
  "/create",
  authenticateToken,
  adminAuth,
  upload.array("productPhoto", 6), // up to 6 files, all sent under the same field name
  createProductValidation,
  createProduct
);
router.get("/getAllProducts", authenticateToken, userAuth, getAllForUser);

router.get("/getAllProductsForAdmin", authenticateToken, adminAuth, getAllForAdmin);

router.get("/getByCategory", authenticateToken, userAuth, getProductByCategory)

router.get("/getOne/:id", authenticateToken, userAuth, getOne)

router.put("/update/:id", authenticateToken, adminAuth, updateProduct)

export default router