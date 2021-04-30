const express = require("express");
const router = express.Router();

const {
  createMusic,
} = require("../../controllers/ChallengeControllers/musicController");

// router.get("/", getAllBody);
router.post("/create", createMusic);
// router.put("/:bodyId", updateBody);
// router.get("/:bodyId", getBodyById);
// router.delete("/:bodyId", deleteBody);

module.exports = router;
