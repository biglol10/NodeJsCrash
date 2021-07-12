const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  }
  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    // https://jwt.io/
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded); // { id: '60e7a4dd43a97e2cf424785f', iat: 1626067445, exp: 1628659445 }

    req.user = await User.findById(decoded.id); // in any route where we use this middleware, we have access to req.user
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // publisher, admin, user (only publisher and admin can change)
    // req.user from protect
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        ) // forbidden
      );
    }
    next();
  };
};
