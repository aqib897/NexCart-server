import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address1: {
    type: String,
    required: true,
  },

  address2: {
    type: String,
  },

  landmark: {
    type: String,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    default: "India",
  },

  type: {
    type: String,
    enum: ["Home", "Office", "Other"],
    default: "Home",
  },

  isDefault: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Address = mongoose.model(
  "Address",
  addressSchema
);
