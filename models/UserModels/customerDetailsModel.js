const mongoose = require("mongoose");

const customerDetailsSchema = mongoose.Schema(
  {
    heroBanner: {
      type: String,
      required: true,
    },
    // membership: {
    //   type: String,
    // },
    goals: [
      {
        type: String,
      },
    ],
    currentFitnessLevel: [
      {
        type: String,
      },
    ],
    age: {
      type: Number,
    },
    height: [
      {
        type: Number,
      },
    ],
    weight: [
      {
        type: Number,
      },
    ],
    measureSystem: {
      type: String,
      default: "metrics",
      enum: ["metrics", "imperial"],
    },

    bmi: [
      {
        type: Number,
      },
    ],
    bmir: [
      {
        type: Number,
      },
    ],
    caloriesPerDay: [
      {
        type: Number,
      },
    ],
    challenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenges",
      },
    ],
    amountOfProtein: {
      type: Number,
    },
    amountOfFat: {
      type: Number,
    },
    amountOfCarbohydrate: {
      type: Number,
    },
    lateMeal: {
      type: Boolean,
    },
    supplementIntake: {
      supplementOption: {
        type: String,
      },
      recipes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
        },
      ],
    },
    myDiet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diet",
      },
    ],
    groceryList: [
      {
        type: String,
      },
    ],
    shoulderSize: [
      {
        type: Number,
      },
    ],
    waistSize: [
      {
        type: Number,
      },
    ],
    hipSize: [
      {
        type: Number,
      },
    ],
    chestSize: [
      {
        type: Number,
      },
    ],
    beforeImageLink: [
      //TODO
      {
        type: String,
      },
    ],
    afterImageLink: [
      //TODO
      {
        type: String,
      },
    ],
    // goal: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Goal'
    // }],
    membership: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membership",
      },
    ],
  },
  {
    timestamps: true,
  }
);

exports.CustomerDetails = mongoose.model(
  "CustomerDetails",
  customerDetailsSchema
);
