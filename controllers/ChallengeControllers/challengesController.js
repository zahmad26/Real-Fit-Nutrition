/*
  TODO:1 GET Trainers ID and pass here
  TODO:2 Create Membership Logic and pass id here in challenge
*/

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { roles } = require("../../utils/roles");
const { Challenges } = require("../../models/ChallengeModels/challengesModel");
const { Trainer } = require("../../models/UserModels/trainerModel");
const { createWorkout } = require("./workoutController");
const { createMusicWithChallenges } = require("./musicController");

// @desc    Create a Challenge
// @route   POST /api/challenges/create
const createChallenge = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json("Body fields cannot be empty.");
  }
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    let WeeksResolved;
    let workoutID;
    if (req.body.weeks.length > 0) {
      const Weeks = Promise.all(
        req.body.weeks.map(async (week) => {
          const Workouts = Promise.all(
            week.workout.map(async (workout) => {
              workoutID = createWorkout(workout);
              return workoutID;
            })
          );
          let workoutsResolved = await Workouts;
          const newWeek = week.weekName;
          return { weekName: newWeek, workouts: workoutsResolved };
        })
      );
      WeeksResolved = await Weeks;
    }
    let musicId;
    let musicsResolved;
    if (req.body.music.length > 0) {
      const musics = Promise.all(
        req.body.music.map(async (music) => {
          musicId = createMusicWithChallenges(music);
          console.log(musicId);
          return musicId;
        })
      );
      musicsResolved = await musics;
    }

    console.log("Musics", musicsResolved);

    let newChallenge = new Challenges({
      challengeName: req.body.challengeName,
      description: req.body.description,
      price: req.body.price,
      currency: req.body.currency,
      thumbnailLink: req.body.thumbnailLink,
      videoThumbnailLink: req.body.videoThumbnailLink,
      access: req.body.access,
      trainers: req.body.trainers, //TODO
      challengeGoals: req.body.challengeGoals,
      tags: req.body.tags,
      body: req.body.body,
      duration: req.body.duration,
      weeks: WeeksResolved, //TODO
      music: musicsResolved,
      results: req.body.results,
      informationList: req.body.informationList,
    });

    newChallenge = await newChallenge.save();
    if (!newChallenge) {
      return res.status(400).json("Challenge cannot be created!");
    } else {
      return res.status(201).json({
        mesage: "Challenge Created Successfully",
        weeks: newChallenge,
      });
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

// @desc    Get challenge by ID
// @route   GET /api/challenges/:challengeId
const getChallengeById = asyncHandler(async (req, res) => {
  const challenge = await Challenges.findById(req.params.challengeId).populate(
    "Tags"
  );

  if (challenge) {
    res.json(challenge);
  } else {
    res.status(404);
    throw new Error("Challenge not found");
  }
});

// // @desc    Get All challenges
// // @route   GET /api/challenges/
const getAllChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenges.find({});
  if (challenges) {
    res.status(200).json({
      challenges,
    });
  } else {
    res.status(404);
    throw new Error("Challenges Cannot be fetched");
  }
});

// // @desc    Update Challenge by Id
// // @route   PUT /api/challenge/:challengeId
const updateChallenge = asyncHandler(async (req, res, next) => {
  try {
    const challenge = await Challenges.findById(req.params.challengeId);

    if (challenge) {
      let update = {
        challengeName: req.body.challengeName
          ? req.body.challengeName
          : challenge.challengeName,
        description: req.body.description
          ? req.body.description
          : challenge.description,
        price: req.body.price ? req.body.price : challenge.price,
        currency: req.body.currency ? req.body.currency : challenge.currency,
        thumbnailLink: req.body.thumbnailLink
          ? req.body.thumbnailLink
          : challenge.thumbnailLink,
        videoThumbnailLink: req.body.videoThumbnailLink
          ? req.body.videoThumbnailLink
          : challenge.videoThumbnailLink,
        // access: req.body.access ? req.body.access : challenge.access,
        duration: req.body.duration ? req.body.duration : challenge.duration,
        duration: req.body.duration ? req.body.duration : challenge.duration,
        results: req.body.results ? req.body.results : challenge.results,
        // informationList: req.body.informationList ? req.body.informationList : challenge.informationList,
        allowComments: req.body.allowComments
          ? req.body.allowComments
          : challenge.allowComments,
        allowReviews: req.body.allowReviews
          ? req.body.allowReviews
          : challenge.allowReviews,
        isPublic: req.body.isPublic ? req.body.isPublic : challenge.isPublic,
      };

      if (req.body.trainers) {
        await Trainer.findByIdAndUpdate(
          challenge.trainers._id,
          req.body.trainers,
          {
            useFindAndModify: false,
          }
        );
      }
    }
    // const update = req.body;
    // const challengeId = req.params.challengeId;
    // await Challenges.findByIdAndUpdate(challengeId, update, {
    //   useFindAndModify: false,
    // });
    // const challenge = await Challenges.findById(challengeId);
    // res.status(200).json({
    //   data: challenge,
    //   message: "challenge has been updated",
    // });
  } catch (error) {
    next(error);
  }
});

// // @desc    Delete challenge
// // @route   Delete /api/challenges/:challengeId
const deleteChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenges.findById(req.params.challengeId);

  if (challenge) {
    await challenge.remove();
    res.json({ message: "Challenge removed" });
  } else {
    res.status(404);
    throw new Error("Challenge not found");
  }
});

const grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      // console.log("Access Granted", req.user.role);
      console.log(req.user);
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  createChallenge,
  getChallengeById,
  getAllChallenges,
  updateChallenge,
  deleteChallenge,
  grantAccess,
};
