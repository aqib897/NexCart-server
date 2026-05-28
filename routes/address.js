import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addAddress,
  deleteAddress,
  getAllAddress,
  getSingleAddress,
  updateAddress,
  getPincodeDetails,
} from "../controler/address.js";

const router = express.Router();

router.get("/pincode/:pin", getPincodeDetails);
router.post("/address/new", isAuth, addAddress);
router.get("/address/all", isAuth, getAllAddress);
router.get("/address/:id", isAuth, getSingleAddress);
router.put("/address/:id", isAuth, updateAddress);
router.delete("/address/:id", isAuth, deleteAddress);


export default router;
