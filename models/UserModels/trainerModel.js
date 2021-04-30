const mongoose = require("mongoose");

const trainerSchema = mongoose.Schema(
  {
    heroBanner: {
      type: String,
    },
    videoTrailerLink: {
      type: String,
    },
    motto: {
      type: String,
    },
    bio: {
      type: String,
    },
    goals: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

exports.Trainer = mongoose.model("Trainer", trainerSchema);
