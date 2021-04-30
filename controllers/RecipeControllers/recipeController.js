const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { Recipe } = require("../../models/RecipeModels/recipeModel");

// @desc    Create Recipe
// @route   POST /api/recipes/recipe/create
const createRecipe = asyncHandler(async (req, res, next) => {
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
    let newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      prepTime: req.body.prepTime,
      kCalPerPerson: req.body.kCalPerPerson,
      saturationIndex: req.body.saturationIndex,
      protein: req.body.protein,
      carbohydrate: req.body.carbohydrate,
      fat: req.body.fat,
      fiber: req.body.fiber,
      mealTypes: req.body.mealTypes,
      foodTypes: req.body.foodTypes,
      diet: req.body.diet,
      ingredients: req.body.ingredients,
      cookingProcess: req.body.cookingProcess,
      notes: req.body.notes,
      tips: req.body.tips,
    });

    newRecipe = await newRecipe.save();
    if (!newRecipe) {
      return res.status(400).json("Recipe cannot be created!");
    } else {
      return res.status(201).json({
        mesage: "Recipe Created Successfully",
        newRecipe,
      });
    }
  } catch (err) {
    return next(err);
  }
});

// @desc    Get Recipe by ID
// @route   GET /api/recipes/recipe/:recipeId
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.recipeId);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error("Body not found");
  }
});

// @desc    Get All Recipes
// @route   GET /api/recipes/recipe/
const getAllRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({});
  if (recipes) {
    res.status(200).json({
      recipes,
    });
  } else {
    res.status(404);
    throw new Error("Body Cannot be fetched");
  }
});

// @desc    Update recipe by Id
// @route   PUT /api/recipes/recipe/:recipeId
const updateRecipe = asyncHandler(async (req, res, next) => {
  try {
    const update = req.body;
    const recipeId = req.params.recipeId;
    await Recipe.findByIdAndUpdate(recipeId, update, {
      useFindAndModify: false,
    });
    const recipe = await Recipe.findById(recipeId);
    res.status(200).json({
      data: recipe,
      message: "Recipe has been updated",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete Recipe
// @route   Delete /api/recipes/recipe/:recipeId
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.recipeId);

  if (recipe) {
    await recipe.remove();
    res.json({ message: "Recipe removed" });
  } else {
    res.status(404);
    throw new Error("Recipe not found");
  }
});

module.exports = {
  createRecipe,
  getRecipeById,
  getAllRecipes,
  deleteRecipe,
  updateRecipe,
};
