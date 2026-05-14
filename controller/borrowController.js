import HttpError from "../middleware/";
import Borrow from "../model/Borrow.js";
import Book from "../model/Book.js";

// borrow
const borrowBook = async (req, res, next) => {
  const { bookId, dueDate } = req.body;

  const userId = req.user._id;

  try {
    if (!bookId || !dueDate) {
      return next(new HttpError("book id and due date are required", 400));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDueDate = new Date(dueDate + "T00:00:00");
    selectedDueDate.setHours(0, 0, 0, 0);

    if (selectedDueDate <= today) {
      return next(new HttpError("due date must be future date", 400));
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return next(new HttpError("book not found", 404));
    }

    if (book.availableCopies <= 0) {
      return next(new HttpError("book is out of stock", 409));
    }

    const alreadyBorrowed = await Borrow.findOne({
      studentId: userId,
      bookId,
      status: "borrowed",
    });

    if (alreadyBorrowed) {
      return next(new HttpError("you already borrowed this book", 409));
    }

    const newBorrow = new Borrow({
      studentId: userId,
      bookId,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      status: "borrowed",
    });

    await newBorrow.save();

    book.availableCopies -= 1;

    await book.save();

    await newBorrow.populate([
      {
        path: "studentId",
        select: "name email",
      },
      {
        path: "bookId",
        select: "title author category",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "book borrowed successfully",
      newBorrow,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// return
const returnBook = async (req, res, next) => {
  const { borrowId } = req.body;

  try {
    if (!borrowId) {
      return next(new HttpError("borrow id is required", 400));
    }

    const borrowBook = await Borrow.findById(borrowId);

    if (!borrowBook) {
      return next(new HttpError("borrow record not found", 404));
    }

    if (borrowBook.status === "returned") {
      return next(new HttpError("book already returned", 409));
    }

    borrowBook.status = "returned";

    borrowBook.returnDate = new Date();

    const today = new Date();

    if (today > borrowBook.dueDate) {
      const lateDays = Math.ceil(
        (today - borrowBook.dueDate) / (1000 * 60 * 60 * 24),
      );

      borrowBook.fine = lateDays * 10;
    }

    await borrowBook.save();

    const book = await Book.findById(borrowBook.bookId);

    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    await borrowBook.populate([
      {
        path: "studentId",
        select: "name email",
      },
      {
        path: "bookId",
        select: "title author",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "book returned successfully",
      borrowBook,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// history
const borrowHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const history = await Borrow.find({
      studentId: userId,
    })
      .populate({
        path: "bookId",
        select: "title author category",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalBooks: history.length,
      history,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  borrowBook,
  returnBook,
  borrowHistory,
};
