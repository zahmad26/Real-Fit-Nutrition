const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { roles } = require("../../utils/roles");
const { Workout } = require("../../models/ChallengeModels/workoutModel");
const { Exercise } = require("../../models/ChallengeModels/exerciseModel");
const { Product } = require("../../models/ShopModels/productModel");
const { Equipment } = require("../../models/ChallengeModels/equipmentModel");
// const { Chal } = require("../models/equipmentModel");

const createWorkout = asyncHandler(async (workout) => {
  try {
    let exerciseIdsResolved;
    if (workout.exercises.length > 0) {
      const exercisesIds = Promise.all(
        workout.exercises.map(async (exercise) => {
          let newExercise;
          workout.isRendered
            ? (newExercise = new Exercise({
                title: exercise.title,
                videoURL: exercise.videoURL ? exercise.videoURL : "",
                exerciseLength: exercise.exerciseLength
                  ? exercise.exerciseLength
                  : null,
                exerciseTime: exercise.exerciseTime
                  ? exercise.exerciseTime
                  : "",
                exerciseGroupName: exercise.exerciseGroupName
                  ? exercise.exerciseGroupName
                  : "",
                voiceOverLink: exercise.voiceOverLink
                  ? exercise.voiceOverLink
                  : "",
              }))
            : (newExercise = new Exercise({
                title: exercise.title,
                videoURL: exercise.videoURL ? exercise.videoURL : "",
              }));

          newExercise = await newExercise.save();

          return newExercise._id;
        })
      );
      exerciseIdsResolved = await exercisesIds;
    }

    let newWorkout = new Workout({
      title: workout.title,
      subtitle: workout.subtitle,
      infoTitle: workout.infotitle,
      infoFile: workout.infoFile,
      equipment: workout.equipment, //ids resolved
      relatedProducts: workout.relatedProducts, //ids aayegi
      introVideoLink: workout.introVideoLink,
      relatedEquipments: workout.relatedEquipments,
      isRendered: workout.isRendered,
      exercises: exerciseIdsResolved, //ids
    });

    newWorkout = await newWorkout.save();
    if (!newWorkout) {
      return null;
    } else {
      // console.log(newWorkout._id);
      return newWorkout._id;
      // return res.status(201).json({
      //   mesage: "Workkout Created Successfully",
      //   newWorkout,
      // });
    }
  } catch (err) {
    console.log(err);
    return err;
  }
});

// @desc    Get workout by ID
// @route   GET /api/workout/:workoutId
const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.challengeId).populate(
    "exercises"
  );

  if (workout) {
    res.json(workout);
  } else {
    res.status(404);
    throw new Error("Workout not found");
  }
});

// @desc    Get All workouts
// @route   GET /api/workouts/
const getAllWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({}).populate("exercises");
  if (workouts) {
    res.status(200).json({
      workouts,
    });
  } else {
    res.status(404);
    throw new Error("Workouts Cannot be fetched");
  }
});

// @desc    Update Workout by Id
// @route   PUT /api/workout/:workoutId
const updateWorkout = asyncHandler(async (req, res, next) => {
  try {
    const update = req.body;
    const workoutId = req.params.workoutId;
    await Workout.findByIdAndUpdate(workoutId, update, {
      useFindAndModify: false,
    });
    const workout = await Workout.findById(workoutId);
    res.status(200).json({
      data: workout,
      message: "Workout has been updated",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete workout
// @route   Delete /api/workouts/:workoutId
const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.workoutId);

  if (workout) {
    await workout.remove();
    res.json({ message: "Workout removed" });
  } else {
    res.status(404);
    throw new Error("Workout not found");
  }
});

module.exports = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  // grantAccess,
};
