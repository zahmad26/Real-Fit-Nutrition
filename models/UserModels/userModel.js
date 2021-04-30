const mongoose = require("mongoose");
// const userRole = require("../models/userRoles");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
      enum: [
        "admin",
        "trainer",
        "nutrist",
        "blogger",
        "shopmanager",
        "customer",
      ],
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other"],
    },
    avatarLink: {
      type: String,
      required: true,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg",
    },
    country: {
      type: String,
      required: false,
    },
    customerDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerDetails",
    },
    trainerDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    // accessToken: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

exports.User = mongoose.model("User", userSchema);
