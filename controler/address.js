import { Address } from "../models/Address.js";
import TryCatch from "../utils/TryCatch.js";

export const updateAddress = TryCatch(async (req, res) => {
  const { address, phone } = req.body;

  const existingAddress = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!existingAddress) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  existingAddress.address = address;
  existingAddress.phone = phone;

  await existingAddress.save();

  res.json({
    message: "Address updated successfully",
    address: existingAddress,
  });
});

export const addAddress = TryCatch(async (req, res) => {
  const { address, phone } = req.body;

  await Address.create({
    address,
    phone,
    user: req.user._id,
  });

  res.status(201).json({
    message: "Address created",
  });
});

export const getAllAddress = TryCatch(async (req, res) => {
  const allAdress = await Address.find({ user: req.user._id });

  res.json(allAdress);
});

export const getSingleAddress = TryCatch(async (req, res) => {
  const singleAddress = await Address.findById(req.params.id);

  res.json(singleAddress);
});

export const deleteAddress = TryCatch(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  await address.deleteOne();

  res.json({
    message: "Address deleted",
  });
});
