import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    bookPic: {
      type: String,
    },

    totalCopies: {
      type: Number,
      required: true,
    },

    availableCopies: {
      type: Number,
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
