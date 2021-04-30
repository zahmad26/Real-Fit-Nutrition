const express = require("express");
const {
  getAllTrainers,
} = require("../../controllers/UserControllers/trainersController");
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  getUserById,
  allowIfLoggedin,
  grantAccess,
} = require("../../controllers/UserControllers/userController");
const {
  protect,
  admin,
  trainer,
  blogger,
  nutrist,
  shopManager,
} = require("../../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", authUser);
router
  .route("/")
  .get(protect, grantAccess("readAny", "profile"), getAllUsers)
  .put(grantAccess("updateAny", "profile"), updateUserProfile);

router.get(
  "/profile",
  protect,
  // allowIfLoggedin,
  grantAccess("readOwn", "profile"),
  getUserProfile
);
router
  .route("/:userId")
  .get(protect, grantAccess("readAny", "profile"), getUserById)
  .put(protect, grantAccess("updateOwn", "profile"), updateUserProfile)
  .delete(protect, grantAccess("deleteAny", "profile"), deleteUser);

module.exports = router;
