import {Router} from "express";
import { createProduct, getAllForUser} from "../controller/product";
import { authenticateToken, adminAuth, userAuth } from "../middleware/auth";
import { upload } from "../middleware/multer";

const router = Router()

router.post(
  "/create",
  authenticateToken,
  adminAuth,
  upload.array("productPhoto", 6), // up to 6 files, all sent under the same field name
  createProduct
);
router.post("/getAllProducts", authenticateToken, userAuth, getAllForUser);

export default router