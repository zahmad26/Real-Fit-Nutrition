const mongoose = require("mongoose");

const challengesSchema = mongoose.Schema(
  {
    challengeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    thumbnailLink: {
      type: String,
      required: true,
    },
    videoThumbnailLink: {
      type: String,
      required: true,
    },
    //TODO: membership
    access: [
      {
        type: String,
      },
    ],
    trainers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    challengeGoals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChallengeGoals",
        required: true,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    body: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Body",
      },
    ],
    // equipment: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Equipment",
    //     required: true,
    //   },
    // ],
    duration: {
      type: Number,
      required: true,
    },

    weeks: [
      {
        weekName: {
          type: String,
          required: true,
        },
        workouts: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout",
            required: true,
          },
        ],
      },
    ],

    music: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],

    results: {
      type: String,
    },

    informationList: [
      {
        info: {
          type: String,
        },
        icon: { type: String },
      },
    ],
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowReviews: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

exports.Challenges = mongoose.model("Challenges", challengesSchema);
