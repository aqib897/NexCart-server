import express from "express";
import {
  loginUser,
  myProfile,
  verifyUser,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controler/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser);
router.get("/user/me", isAuth, myProfile);
router.get("/users", isAuth, getAllUsers);

router.get("/user/:id", isAuth, getSingleUser);

router.put("/user/:id/role", isAuth, updateUserRole);
router.delete("/user/:id", isAuth, deleteUser);

export default router;
