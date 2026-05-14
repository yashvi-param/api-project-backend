import HttpError from "./HttpError.js";

const checkRole =
  (...Roles) =>
  async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new HttpError("unAuthorization", 401));
      }
      if (!Roles.includes(req.user.role)) {
        return next(
          new HttpError("Access denied: insufficient permissions", 403),
        );
      }
      next();
    } catch (error) {
      next(new HttpError(error.message, 500));
    }
  };

export default checkRole;
