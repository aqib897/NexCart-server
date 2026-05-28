import { Address } from "../models/Address.js";
import TryCatch from "../utils/TryCatch.js";
import axios from "axios";

export const updateAddress = TryCatch(async (req, res) => {
  const {
  firstName,
  lastName,
  phone,
  address1,
  address2,
  landmark,
  city,
  state,
  pincode,
  type,
} = req.body;

  export const getPincodeDetails = TryCatch(
  async (req, res) => {

    const { pin } = req.params;

    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pin}`,
      {
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      }
    );

    const data = response.data[0];

    if (
      data.Status !== "Success" ||
      !data.PostOffice?.length
    ) {
      return res.status(404).json({
        message: "Invalid pincode",
      });
    }

    res.json({
      city: data.PostOffice[0].District,
      state: data.PostOffice[0].State,
    });
  }
);
  
  const existingAddress = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!existingAddress) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  existingAddress.firstName = firstName;
  existingAddress.lastName = lastName;
  
  existingAddress.phone = phone;
  
  existingAddress.address1 = address1;
  existingAddress.address2 = address2;
  
  existingAddress.landmark = landmark;
  
  existingAddress.city = city;
  existingAddress.state = state;
  
  existingAddress.pincode = pincode;
  
  existingAddress.type = type;

  await existingAddress.save();

  res.json({
    message: "Address updated successfully",
    address: existingAddress,
  });
});

export const addAddress = TryCatch(async (req, res) => {
  const {
  firstName,
  lastName,
  phone,
  address1,
  address2,
  landmark,
  city,
  state,
  pincode,
  type,
} = req.body;

  await Address.create({
  firstName,
  lastName,
  phone,
  address1,
  address2,
  landmark,
  city,
  state,
  pincode,
  type,
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
