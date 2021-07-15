// This functionality is only for admin

const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// anything below this is going to use protect
// all the routes will use protect and authorize('admin')
router.use(protect);
router.use(authorize("admin"));

// we want to use protect and authorize admin for all of the routes
// instead of putting in get() put in above the router // router.use(protect);
router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
