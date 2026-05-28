import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        id: String,
        url: String,
      },
    ],

    videos: [
      {
        id: String,
        url: String,
      },
    ],
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      id: String,
      url: String,
    },
  ],
  sold: {
    type: Number,
    default: 0,
  },
  totalStock: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],

  numReviews: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Product = mongoose.model("Product", productSchema);
