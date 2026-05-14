import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const newUser = {
      name,
      email,
      password,
      role,
      phone,
    };

    const user = new User(newUser);

    await user.save();
    const token = await user.generateAuthToken();
    res
      .status(201)
      .json({ success: true, message: "added successfully!", user, token });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return next(new HttpError("unable to login", 400));
    }

    const token = await user.generateAuthToken();
    res
      .status(200)
      .json({ success: true, message: "successfully login!!", user, token });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new HttpError("user not found", 404));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logOut = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(req.user);

    user.tokens = user.tokens.filter((t) => {
      return t.token != req.token;
    });
    console.log(req.token);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "user logout successfully!!" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res
      .status(200)
      .json({ success: true, message: "user logout all device successfully!" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const allUser = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return next(new HttpError("user not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "user data fetched successfully!!",
      length: users.length,
      users,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const allowedUser = req.params.id || req.user._id;

    const user = await User.findById(allowedUser);
    if (!user) {
      return next(new HttpError("user not found", 404));
    }

    const updates = Object.keys(req.body);

    const allowed = ["name", "password", "phone"];

    const isValid = updates.every((field) => allowed.includes(field));

    if (!isValid) {
      return next(new HttpError("only allowed field can be updated", 400));
    }
    if (
      req.user.role !== "admin" &&
      req.user.role !== "super_admin" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return next(new HttpError("access denied", 403));
    }
    updates.forEach((update) => {
      if (update !== "password") {
        user[update] = req.body[update];
      }
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "user data updated successfully!",
      user,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const allowedUser = req.params.id || req.user._id;

    const user = await User.findById(allowedUser);
    if (!user) {
      return next(new HttpError("user not found", 404));
    }
    if (
      req.user.role !== "admin" &&
      req.user.role !== "super_admin" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return next(new HttpError("access denied", 403));
    }

    await user.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "user delete successfully!" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  addUser,
  login,
  authLogin,
  logOut,
  logOutAll,
  allUser,
  updateUser,
  deleteUser,
};
