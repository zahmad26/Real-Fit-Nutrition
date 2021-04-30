const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { tags } = require("../../models/ChallengeModels/tagsModel");
const generateToken = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const {
  CustomerDetails,
} = require("../../models/UserModels/customerDetailsModel");
const { User } = require("../../models/UserModels/userModel");
const { Recipe } = require("../../models/RecipeModels/recipeModel");
const { Challenges } = require("../../models/ChallengeModels/challengesModel");
const {
  ChallengeGoals,
} = require("../../models/ChallengeModels/challengeGoalsModel");

// @desc    Create Customer role by ID
// @route   POST /api/customer/create
// @access  Private
const createCustomer = asyncHandler(async (req, res, next) => {
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
      return res.status(400).json("Customer cannot be created!");
    } else {
      return res.status(201).json({
        mesage: "Customer created Successfully",
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

// @desc    Get All Customer Details
// @route   GET /api/customerDetails/all
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "customer" })
    .select("-passwordHash")
    .populate("customerDetails");
  if (customers) {
    res.status(200).json({
      customers,
    });
  } else {
    res.status(404);
    throw new Error("Customers with Details Cannot be fetched");
  }
});

// @desc    Get Customer Details by ID
// @route   GET /api/customerDetails/:customerDetailsId
const getCustomerById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.customerId);

  if (user) {
    if (user.role === "customer") {
      return res.status(201).json({
        message: "Customer with Details fetched successfully",
        customer: user,
      });
    } else {
      return res.status(404).json({
        message: "The user requested is not a customer.",
      });
    }
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

// @desc    Update Customer Details by Id
// @route   PUT /api/customerDetails/:customerId
const updateCustomer = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.customerId);

  if (user.role === "customer") {
    try {
      let customerDetails;

      let update = {
        username: req.body.username ? req.body.username : user.username,
        email: req.body.email ? req.body.email : user.email,
        firstName: req.body.firstName ? req.body.firstName : user.firstName,
        lastName: req.body.lastName ? req.body.lastName : user.lastName,
        passwordHash: req.body.password
          ? bcrypt.hashSync(req.body.password, 10)
          : user.passwordHash,
      };
      console.log(req.body.customerDetails);
      const customerId = req.params.customerId;
      if (req.body.customerDetails) {
        if (user.customerDetails) {
          await CustomerDetails.findByIdAndUpdate(
            user.customerDetails._id,
            req.body.customerDetails,
            {
              useFindAndModify: false,
            }
          );
        } else {
          customerDetails = new CustomerDetails(req.body.customerDetails);
          await customerDetails.save();
          user.customerDetails = await customerDetails._id;

          await user.save();
        }

        console.log(customerDetails);
      }

      await User.findByIdAndUpdate(customerId, update, {
        useFindAndModify: false,
      });

      console.log(user);
      //
      const customer = await User.findById(customerId)
        .populate("customerDetails")
        .select("-passwordHash");
      return res.status(200).json({
        data: customer,
        message: "Customer has been updated",
      });
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(404).json({
      message: "The user requested is not a customer.",
    });
  }
});

// @desc    Get Recommended challenges for User based on the Goals they set
//          by mappping to challengesGoals
// @route   GET /api/customerDetails/:customerId/recommendedChallenge
const getRecommendedChallenge = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.customerId)
    .select("-passwordHash")
    .populate("customerDetails");
  const custGoals = await customer.customerDetails.goals;
  //goals []
  const challenges = await Challenges.find({}).populate("challengeGoals");

  let isFound = false;
  if (challenges && custGoals) {
    let recommendedchallenge = [];

    for (let chall of challenges) {
      const challGoals = chall.challengeGoals;
      console.log(chall);
      if (challGoals.length > 0) {
        for (let goal of custGoals) {
          for (let cg of challGoals) {
            if (goal === cg.name) {
              recommendedchallenge.push(chall);
              isFound = true;
              break;
            }
          }
          if (isFound) {
            isFound = false;
            break;
          }
        }
      }
    }

    if (recommendedchallenge.length > 0) {
      res.status(200).json({
        recommendedchallenge,
      });
    } else {
      res.status(404);
      throw new Error(
        "You haven't set you Goals yet.Please update your profile to view recommended Challenges"
      );
    }
  } else {
    res.status(404);
    throw new Error("Challenges/Goals not fetched");
  }
  // const challGoals = await challenges.challengeGoals;
});

// @desc    Recommend Weekly Diet based on calories
// @route  GET /api/customerDetails/:customerId/recommendedWeeklyDiet
const recommendedWeeklyDiet = asyncHandler(async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.customerId)
      .select("-passwordHash")
      .populate({
        path: "customerDetails",
        model: "CustomerDetails",
        populate: {
          path: "myDiet",
          model: "Diet",
          select: "name -_id",
        },
      });

    const caloriesPerDay = await customer.customerDetails.caloriesPerDay;
    const dietOptions = await customer.customerDetails.myDiet;
    const lateMeal = await customer.customerDetails.lateMeal;
    const supplements = await customer.customerDetails.supplementIntake;

    //supplement meal
    for (let r of supplements.recipe) {
      caloriesPerDay -= r.kCalPerPerson;
    }
    let extraMeal = false;
    if (supplements.supplementOption == "extra meal") {
      extraMeal = true;
    }

    let weeklyDietPlan = [];
    let breakfastRecipes = [];
    let lunchRecipes = [];
    let dinnerRecipes = [];
    let snackRecipes = [];

    const recipes = await Recipe.find()
      .populate({ path: "diet", model: "Diet", select: "name -_id" })
      .populate({ path: "mealTypes", model: "MealType", select: "name -_id" });

    // console.log("diet",recipes[0].diet);
    // console.log("mealTypes",recipes[0].mealTypes);
    let isFound = false;
    if (recipes) {
      for (let recipe of recipes) {
        for (let myDiet of dietOptions) {
          for (let diet of recipe.diet) {
            if (myDiet.name == diet.name) {
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            break;
          }
        }
        if (isFound) {
          //filteredRecipes.push(recipe);
          for (let meal of recipe.mealTypes) {
            if (meal.name == "breakfast") {
              breakfastRecipes.push(recipe);
            }
            if (meal.name == "lunch") {
              lunchRecipes.push(recipe);
            }
            if (meal.name == "dinner") {
              dinnerRecipes.push(recipe);
            }
            if (meal.name == "snack") {
              snackRecipes.push(recipe);
            }
          }
        }
      }
      let dayPlan = {};
      let calories = caloriesPerDay;
      for (let breakfast of breakfastRecipes) {
        if (breakfast.kCalPerPerson < calories) {
          dayPlan.breakfast = breakfast;
          calories -= breakfast.kCalPerPerson;
          for (let lunch of lunchRecipes) {
            if (lunch.kCalPerPerson < calories && lunch._id != breakfast._id) {
              dayPlan.lunch = lunch;
              calories -= lunch.kCalPerPerson;
              for (let dinner of dinnerRecipes) {
                if (
                  dinner.kCalPerPerson < calories &&
                  dinner._id != lunch._id &&
                  dinner._id != breakfast._id
                ) {
                  dayPlan.dinner = dinner;
                  calories -= dinner.kCalPerPerson;
                  console.log("dayplan:", dayPlan);
                  weeklyDietPlan.push(dayPlan);
                }
              }
            }
          }
        }
      }
    } else {
      console.log("Recipes not found");
    }

    // await Recipe.findByIdAndUpdate(recipeId, update, {
    //   useFindAndModify: false,
    // });
    // const recipe = await Recipe.findById(recipeId);
    // res.status(200).json({
    //   data: recipe,
    //   message: "Recipe has been updated",
    // });
  } catch (error) {
    next(error);
  }
});
// for (let snack of snackRecipes) {
//   if (snack.kCalPerPerson < calories) {
//     dayPlan.snack = snack;
//     calories -= snack.kCalPerPerson;
//     for (let snack2 of snackRecipes) {
//       if (snack2.kCalPerPerson < calories) {
//         dayPlan.snack2 = snack2;
//         calories -= snack2.kCalPerPerson;
//         weeklyDietPlan.push(dayPlan);
//       }
//     }
//   }
// }
module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  getRecommendedChallenge,
  recommendedWeeklyDiet,
};
