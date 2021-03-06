const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");

// Include other resource routers  // example: {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
// protect
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
// if /:bootcampId/courses is hit it is gonna continue on to courses.js router.route('/') and call getCourses
router.use("/:bootcampId/courses", courseRouter); // Think this as forwarding
router.use("/:bootcampId/reviews", reviewRouter); // Think this as forwarding

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

// router.route("/").get(getBootcamps).post(createBootcamp);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
