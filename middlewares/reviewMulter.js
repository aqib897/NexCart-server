import multer from "multer";

const storage = multer.memoryStorage();

const reviewUpload = multer({
  storage,
});

export default reviewUpload;
