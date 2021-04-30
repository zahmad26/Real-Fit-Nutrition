const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");
// app.use(bodyParser.urlencoded({ extended: true }));

//importing routes
const usersRouter = require("./routes/UserRoutes/userRoutes");
const challengesRouter = require("./routes/ChallengesRoutes/challengesRoutes");
const equipmentRouter = require("./routes/ChallengesRoutes/equipmentRoutes");
const tagsRouter = require("./routes/ChallengesRoutes/tagRoutes");
const challengeGoalsRouter = require("./routes/ChallengesRoutes/challengeGoalsRoutes");
const bodyRouter = require("./routes/ChallengesRoutes/bodyRoutes");
const mediaManagerRouter = require("./routes/MediaManagerRoutes/mediaManagerRoutes");
const workoutRouter = require("./routes/ChallengesRoutes/workoutRoutes");
// const productRouter = require("./routes/ShopRoutes/productRoutes");
const trainerRouter = require("./routes/UserRoutes/trainerRoutes");
const customerDetailsRouter = require("./routes/UserRoutes/customerDetailsRoutes");
const musicRouter = require("./routes/ChallengesRoutes/musicRoutes");
const recipeRouter = require("./routes/RecipeRoutes/recipeRoutes");
const dietRouter = require("./routes/RecipeRoutes/dietRoutes");
const foodTypeRouter = require("./routes/RecipeRoutes/foodTypeRoutes");
const mealTypeRouter = require("./routes/RecipeRoutes/mealTypeRoutes");
const ingredientRouter = require("./routes/RecipeRoutes/ingredientRoutes");
const productRouter = require("./routes/ShopRoutes/productRoutes");
const categoryRouter = require("./routes/ShopRoutes/categoryRoutes");

dotenv.config();

// Connecting Database
connectDB();

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
// enables cors
app.use(cors());
// Import
app.use("/api/media", mediaManagerRouter);
app.use("/api/users", usersRouter);
app.use("/api/challenges", challengesRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/challengeGoals", challengeGoalsRouter);
app.use("/api/body", bodyRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/product", productRouter);
app.use("/api/trainers", trainerRouter);
app.use("/api/customerDetails", customerDetailsRouter);
app.use("/api/musics", musicRouter);
app.use("/api/recipes/recipe", recipeRouter);
app.use("/api/recipes/diet", dietRouter);
app.use("/api/recipes/foodType", foodTypeRouter);
app.use("/api/recipes/mealType", mealTypeRouter);
app.use("/api/recipes/ingredient", ingredientRouter);
app.use("/api/shop/product", productRouter);
app.use("/api/shop/category", categoryRouter);

//Handling 404 route
app.use(notFound);

//Custom error Middleware
app.use(errorHandler);
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
