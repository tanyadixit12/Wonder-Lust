const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utlis/wrap.js");
const ExpressError= require("../utlis/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

// review post route
router.post("/",isLoggedIn, wrapAsync(reviewController.createReview));

// review delete route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;