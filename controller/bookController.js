import HttpError from "../middleware/HttpError.js";
import Book from "../model/Book.js";

const createBook = async (req, res, next) => {
  try {
    const { title, author, category, totalCopies, availableCopies } = req.body;

    const newBook = {
      title,
      author,
      category,
      totalCopies,
      availableCopies,
      bookPic: req.file ? req.file.path : null,
      cloudinary_id: req.file ? req.file.filename : null,
    };
    const book = new Book(newBook);

    await book.save();
    res
      .status(201)
      .json({ success: true, message: "book added successfully!", book });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
const getBook = async (req, res, next) => {
  try {
    const books = await Book.find({});
    if (books.length === 0) {
      return next(new HttpError("book not available", 404));
    }
    res.status(200).json({
      success: true,
      message: "all book fetched successfully..!",
      books,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new HttpError("book not find", 404));
    }
    const updates = Object.keys(req.body);

    const allowedField = [
      "title",
      "author",
      "category",
      "totalCopies",
      "availableCopies",
    ];

    const validUpdates = updates.every((field) => allowedField.includes(field));

    if (!validUpdates) {
      return next(new HttpError("only allowed field can be updated", 400));
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return next(new HttpError("access denied", 403));
    }

    updates.forEach((update) => {
      book[update] = req.body[update];
    });

    if (req.file) {
      if (book.cloudinary_id) {
        await cloudinary.uploader.destroy(book.cloudinary_id);
      }
      book.bookPic = req.file.path;
      book.cloudinary_id = req.file.filename;
    }

    await book.save();

    res
      .status(200)
      .json({ success: true, message: "data updated successfully", book });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new HttpError("book not found"));
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return next(new HttpError("access denied", 403));
    }

    if (book.cloudinary_id) {
      await cloudinary.uploader.destroy(book.cloudinary_id);
    }

    await book.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "book delete successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
export default { createBook, getBook, updateBook, deleteBook };
