import {Router} from "express";
import { createProduct, getAllForUser, getAllForAdmin } from "../controller/product";
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

export default router