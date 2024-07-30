if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utlis/wrap.js")
const ExpressError= require("./utlis/ExpressError.js")
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Wounder-Lust";
const dbUrl = process.env.ATLAS_URL;



async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//mongo session
const store=MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
      secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

// express session
const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOption));
app.use(flash());

// for login and signup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// flash middleware
app.use((req, res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter );

app.all("*", (req,res,next) =>{
  next(new ExpressError(404, "page not found"));
})
// middleware
app.use((err,req,res,next) =>{
  // res.send("something went wrong !");
  let {status = 500, message = "something went wrong"} = err;
  // res.status(status).send(message);
  res.status(status).render("listings/error.ejs", {message})
})

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});


// mongo atlas
// hC1XGSVgTAF0FxMO
// rahulraj14

// mongodb link
// mongodb+srv://rahulraj14:<password>@cluster0.m5kdhks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// mongodb+srv://rahulraj14:hC1XGSVgTAF0FxMO@cluster0.m5kdhks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// hHbBhpb5RaykkdKO