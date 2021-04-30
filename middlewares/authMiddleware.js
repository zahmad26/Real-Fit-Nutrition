const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModels/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-passwordHash");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
const admin = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
};

const trainer = (req, res, next) => {
  if (req.user && req.user.role == "trainer") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Trainer");
  }
};

const nutrist = (req, res, next) => {
  if (req.user && req.user.role == "nutrist") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Nutrist");
  }
};

const blogger = (req, res, next) => {
  if (req.user && req.user.role == "blogger") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Blogger");
  }
};

const shopManager = (req, res, next) => {
  if (req.user && req.user.role == "shopmanager") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Shop-Manager");
  }
};

//   const trainer = (req, res, next) => {
//     if (req.user && req.user.roleId == 1) {
//       next();
//     } else {
//       res.status(401);
//       throw new Error("Not authorized as an Trainer");
//     }
//   };

module.exports = {
  protect,
  admin,
  trainer,
  nutrist,
  blogger,
  shopManager,
};
