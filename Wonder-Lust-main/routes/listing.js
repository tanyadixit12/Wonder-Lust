const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrap.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const ExpressError= require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({ storage });
// const upload=multer({ dest: 'uploads/' });

//index and create route
router.route("/")
.get( wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing));


//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm );


//show , delete and update route
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;