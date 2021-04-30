const mongoose = require("mongoose");

const workoutSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    infoTitle: {
      type: String,
    },
    infoFile: {
      type: String,
    },
    relatedEquipments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
        required: true,
      },
    ],
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    introVideoLink: {
      type: String,
    },
    // selectedRelatedEquipments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Equipment",
    //   },
    // ],
    isRendered: {
      type: Boolean,
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
  },
  { timestamps: true }
);

exports.Workout = mongoose.model("Workout", workoutSchema);
