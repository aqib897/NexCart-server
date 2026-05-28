import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateProductImage,
  deleteProduct,
  addReview,
} from "../controler/product.js";
import uploadFiles from "../middlewares/multer.js";
import reviewUpload from "../middlewares/reviewMulter.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);

router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuth, updateProduct);
router.post("/product/:id", isAuth, uploadFiles, updateProductImage);
router.delete("/product/:id", isAuth, deleteProduct);
router.post(
  "/product/:id/review",
  isAuth,
  reviewUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  addReview,
);
router.delete("/product/:productId/review/:reviewId", isAuth, deleteReview);

router.put("/product/:productId/review/:reviewId", isAuth, editReview);

export default router;
