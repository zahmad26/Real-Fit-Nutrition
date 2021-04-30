const express = require("express");
const router = express.Router();

const {
  createChallenge,
  getChallengeById,
  getAllChallenges,
  updateChallenge,
  deleteChallenge,
  grantAccess,
} = require("../../controllers/ChallengeControllers/challengesController");
const {
  protect,
  admin,
  trainer,
  blogger,
  nutrist,
  shopManager,
} = require("../../middlewares/authMiddleware");

router.post(
  "/create",
  // protect,
  // grantAccess("updateAny", "challenge"),
  createChallenge
);
router.get("/:challengeId", getChallengeById);
router.get("/", getAllChallenges);
router.put(
  "/:challengeId",
  protect,
  grantAccess("updateAny", "challenge"),
  updateChallenge
);
router.delete(
  "/:challengeId",
  protect,
  grantAccess("deleteAny", "challenge"),
  deleteChallenge
);

module.exports = router;
