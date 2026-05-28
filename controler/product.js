import { Product } from "../models/Product.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "cloudinary";

export const addReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];

    for (const file of imageFiles) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const result = await cloudinary.v2.uploader.upload(base64, {
        folder: "nexcart/reviews/images",
      });

      images.push({
        id: result.public_id,
        url: result.secure_url,
      });
    }

    for (const file of videoFiles) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const result = await cloudinary.v2.uploader.upload(base64, {
        resource_type: "video",
        folder: "nexcart/reviews/videos",
      });

      videos.push({
        id: result.public_id,
        url: result.secure_url,
      });
    }

    if (!name || !comment || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const review = {
      user: req.user._id,
      name,
      rating: Number(rating),
      comment,
    };

    const alreadyReviewed = product.reviews.find((r) => r.name === name);

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    product.reviews.unshift(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review Added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const editReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const product = await Product.findById(req.params.productId);

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    review.comment = comment;
    review.rating = rating;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json({
      message: "Review Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    product.reviews.pull(req.params.reviewId);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => acc + item.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    res.json({
      message: "Review Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "Unauthorized",
    });

  const { title, description, category, price, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "No images uploaded",
    });

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  const product = await Product.create({
    title,
    description,
    category,
    price,
    stock,
    totalStock: stock,
    images: uploadedImage,
  });

  res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

export const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  const limit = 8;

  const pageNumber = Number(page) || 1;
  const skip = (pageNumber - 1) * limit;

  let sortOption = { createdAt: -1 };

  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "highToLow") {
      sortOption = { price: -1 };
    }
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  const categories = await Product.distinct("category");

  const newProduct = await Product.find().sort({ createdAt: -1 }).limit(4);

  const countProduct = await Product.countDocuments(filter);

  const totalPages = Math.ceil(countProduct / limit);

  res.json({ products, categories, totalPages, newProduct });
});

export const getSingleProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json({ product, relatedProduct });
});

export const updateProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "Unauthorized",
    });

  const { title, description, category, price, stock } = req.body;

  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (stock !== undefined) {
    const product = await Product.findById(req.params.id);

    const restockAmount = Number(stock);

    updateFields.stock = Number(product.stock) + restockAmount;

    updateFields.totalStock = Number(product.totalStock || 0) + restockAmount;
  }
  if (price !== undefined) updateFields.price = price;
  if (category) updateFields.category = category;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedProduct)
    return res.status(400).json({
      message: "Product not found",
    });

  res.json({
    message: "Product Updated",
    updatedProduct,
  });
});

export const updateProductImage = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "Unauthorized",
    });
  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "No images uploaded",
    });

  const product = await Product.findById(id);

  if (!product)
    return res.status(400).json({
      message: "Product not found",
    });

  const oldImages = product.images || [];

  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  product.images = uploadedImage;

  await product.save();

  res.status(200).json({
    message: "Image Updated",
    product,
  });
});

export const deleteProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "Unauthorized",
    });

  const product = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).json({
      message: "Product not found",
    });

  const oldImages = product.images || [];

  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
});
