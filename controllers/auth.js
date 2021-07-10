const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //   // Create token
  //   // Static is called on User the model itself and method is called on user (capital vs lowercase) the actual user that we get
  //   const token = user.getSignedJwtToken();

  //   res.status(200).json({ success: true, token });

  sendTokenResponse(user, 200, res);
});

// @desc        Login user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //   // Create token
  //   // Static is called on User the model itself and method is called on user (capital vs lowercase) the actual user that we get
  //   const token = user.getSignedJwtToken();

  //   res.status(200).json({ success: true, token });

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // httpOnly: true => only want the cookie to be accessed to the client side script
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true; // cookie in https
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
