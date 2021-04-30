const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { roles } = require("../../utils/roles");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/UserModels/userModel");
const { Trainer } = require("../../models/UserModels/trainerModel");

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json("Body fields cannot be empty.");
  }
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    console.log(req.body);
    let credentials = {
      username: req.body.username,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
    };

    const user = await User.findOne({ username: credentials.username });

    if (!user) {
      return res.status(500).json({
        message:
          "User doesn't exist.Provide correct credentials or register yourself if you are not already registered.",
      });
    } else {
      if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        return res.status(200).json({
          message: "User Logged In successfully!",
          username: user.username,
          user_id: user.id,
          role: user.role,
          token: generateToken(user._id, user.role, user.email, user.username),
        });
      } else {
        return res.status(400).json("Please enter correct credentials");
      }
    }
  } catch (err) {
    return next(err);
  }
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { username, email } = req.body;
    const userExist = await User.findOne({ username });
    const emailExist = await User.findOne({ email });
    if (userExist || emailExist) {
      return res.status(400).json("User Already exist with this email");
    }
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      // roleId: 4,
    });
    console.log(newUser);
    newUser = await newUser.save();

    if (!newUser) {
      return res.status(400).json("User cannot be created!");
    } else {
      return res.status(201).json({
        mesage: "User Created Successfully",
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,

        token: generateToken(
          newUser._id,
          newUser.role,
          newUser.email,
          newUser.username
        ),
      });
    }
  } catch (err) {
    return next(err);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("userRole")
    .select("-passwordHash");
  if (user) {
    res.json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update User by Id
// @route   GET /api/users/:id
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update, { useFindAndModify: false });
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-passwordHash");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get All users profile
// @route   GET /api/users/
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-passwordHash");
  if (users) {
    res.status(200).json({
      users,
    });
  } else {
    res.status(404);
    throw new Error("Users Cannot be fetched");
  }
});

// @desc    Delete user
// @route   Delete /api/users/:userId
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    if (user.trainerDetails) {
      await Trainer.findById(user.trainerDetails).remove();
    } else if (user.customerDetails) {
      await CustomerDetails.findById(user.customerDetails).remove();
    }
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Create users by role
// @route   GET /api/users/create
// @access  Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { username, email } = req.body;
    const userExist = await User.findOne({ username });
    const emailExist = await User.findOne({ email });
    if (userExist || emailExist) {
      return res
        .status(400)
        .json("User Already exist with this username/email.");
    }
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role,
    });
    console.log(newUser);
    newUser = await newUser.save();

    if (!newUser) {
      return res.status(400).json("User cannot be created!");
    } else {
      return res.status(201).json({
        mesage: "User Created Successfully",
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,

        token: generateToken(
          newUser._id,
          newUser.role,
          newUser.email,
          newUser.username
        ),
      });
    }
  } catch (err) {
    return next(err);
  }
});

const grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      // console.log("Access Granted", req.user.role);
      // console.log(resource);
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    console.log(user);
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserById,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  allowIfLoggedin,
  grantAccess,
};
