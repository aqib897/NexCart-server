import { OTP } from "../models/Otp.js";
import sendOtp from "../utils/sendOtp.js";
import TryCatch from "../utils/TryCatch.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Address } from "../models/Address.js";
import { Order } from "../models/Order.js";

export const loginUser = TryCatch(async (req, res) => {
  try {
    const { email, name } = req.body;

    const subject = "NexCart OTP Verification";

    const otp = Math.floor(100000 + Math.random() * 900000);

    const prevOtp = await OTP.findOne({
      email,
    });

    if (prevOtp) {
      await prevOtp.deleteOne();
    }
    await sendOtp(email, subject, otp);

    await OTP.create({ name, email, otp });

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp, name } = req.body;

  const haveOtp = await OTP.findOne({
    email,
    otp,
  });

  if (!haveOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  let user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });
    await haveOtp.deleteOne();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } else {
    user = await User.create({
      name: haveOtp.name,
      email,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  }
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    user,
  });
});

export const getAllUsers = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const users = await User.find().sort({ createdAt: -1 });

  const usersWithAddress = await Promise.all(
    users.map(async (user) => {
      const address = await Address.findOne({
        user: user._id,
      });

      return {
        ...user._doc,

        phone: address?.phone || "N/A",

        address: address?.address || "N/A",
      };
    }),
  );

  res.json(usersWithAddress);
});

export const getSingleUser = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const addresses = await Address.find({
    user: user._id,
  });

  const orders = await Order.find({
    user: user._id,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.json({
    user,
    addresses,
    orders,
  });
});

export const updateUserRole = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.role = role;

  await user.save();

  res.json({
    message: "User role updated",
    user,
  });
});

export const deleteUser = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  await Address.deleteMany({
    user: user._id,
  });

  await Order.deleteMany({
    user: user._id,
  });

  await user.deleteOne();

  res.json({
    message: "User deleted successfully",
  });
});
