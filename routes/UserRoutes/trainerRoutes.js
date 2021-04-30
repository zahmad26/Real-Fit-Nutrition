const express = require("express");
const router = express.Router();
const {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainerById,
} = require("../../controllers/UserControllers/trainersController");
const {
  protect,
  admin,
  trainer,
  blogger,
  nutrist,
  shopManager,
} = require("../../middlewares/authMiddleware");

router.post("/create", protect, admin, createTrainer);
router.get("/all", protect, getAllTrainers);
router.put("/:trainerId", protect, trainer, updateTrainerById);

module.exports = router;
