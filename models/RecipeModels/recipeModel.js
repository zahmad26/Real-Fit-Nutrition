const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    prepTime: {
      type: Number,
      required: true,
    },
    kCalPerPerson: {
      type: Number,
      required: true,
    },
    saturationIndex: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbohydrate: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    fiber: {
      type: Number,
      required: true,
    },
    mealTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealType",
      },
    ],
    foodTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodType",
      },
    ],
    diet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diet",
      },
    ],
    ingredients: [
      {
        name: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
        },
        weight: { type: Number },
        volume: { type: Number },
        pieces: { type: Number },
        method: { type: String },
        other: { type: String },
      },
    ],
    cookingProcess: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
    },
    tips: {
      type: String,
    },
  },
  { timestamps: true }
);

exports.Recipe = mongoose.model("Recipe", recipeSchema);
