const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { roles } = require("../../utils/roles");
const bcrypt = require("bcryptjs");
const { Music } = require("../../models/ChallengeModels/musicModel");

// @desc    Create Music
// @route   GET /api/music/create
// @access  Public
const createMusicWithChallenges = asyncHandler(async (music) => {
  try {
    let newMusic = new Music({
      name: music.name,
      url: music.url,
    });

    newMusic = await newMusic.save();

    if (newMusic) {
      return newMusic._id;
    }
    return null;
    // if (!newMusic) {
    //   return res.status(400).json("Music cannot be created!");
    // } else {
    //   return res.status(201).json({
    //     mesage: "Music Created Successfully",
    //     newMusic,
    //   });
    // }
  } catch (err) {
    console.log(err);
  }
});

// @desc    Create Music
// @route   GET /api/music/create
// @access  Public
const createMusic = asyncHandler(async (req, res, next) => {
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
    let newMusic = new Music({
      name: req.body.name,
      url: req.body.url,
    });

    newMusic = await newMusic.save();
    if (!newMusic) {
      return res.status(400).json("Music cannot be created!");
    } else {
      return res.status(201).json({
        mesage: "Music Created Successfully",
        newMusic,
      });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = {
  createMusicWithChallenges,
  createMusic,
};
