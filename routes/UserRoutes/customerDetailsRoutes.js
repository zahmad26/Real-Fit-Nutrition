const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  getRecommendedChallenge,
  recommendedWeeklyDiet,
} = require("../../controllers/UserControllers/customerDetailsController");
const {
  protect,
  admin,
  trainer,
  blogger,
  nutrist,
  shopManager,
} = require("../../middlewares/authMiddleware");

router.post("/create", protect, admin, createCustomer);
router.get("/all", protect, getAllCustomers);
router.get("/:customerId/recommendedChallenges", getRecommendedChallenge);
router.get("/:customerId/recommendedWeeklyDiet", recommendedWeeklyDiet);
router.get("/:customerId", protect, getCustomerById);
router.put("/:customerId", protect, updateCustomer);

module.exports = router;
