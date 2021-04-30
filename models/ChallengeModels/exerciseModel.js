const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
    },
    exerciseLength: {
      type: String, //0:34
    },
    break: {
      type: Number,
    },
    exerciseGroupName: {
      type: String,
    },
    voiceOverLink: {
      type: String,
    },
  },
  { timestamps: true }
);

exports.Exercise = mongoose.model("Exercise", exerciseSchema);
