const express = require("express");
const router = express.Router();

const {
    createRecipe,
    getRecipeById,
    deleteRecipe,
    getAllRecipes,
    updateRecipe,
} = require("../../controllers/RecipeControllers/recipeController");

router.get("/", getAllRecipes);
router.post("/create", createRecipe);
router.put("/:recipeId", updateRecipe);
router.get("/:recipeId", getRecipeById);
router.delete("/:recipeId", deleteRecipe);

module.exports = router;