// const express=require("express");
// const app=express();
// const path=require("path");
// const methodOverride=require("method-override");
// const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
// const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
// const session=require("express-session");
// const flash=require("connect-flash");
// const passport=require("passport");
// const localStrategy=require("passport-local");
// const User=require("./models/user.js");

// const mongoose = require('mongoose');
// const Listing=require("./models/listing.js");
// app.set("views",path.join(__dirname,"views"));
// app.set("view engine","ejs");
// app.use(express.static(path.join(__dirname,"public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);

// const Review=require("./models/reviews.js");
// const listingRouter=require("./routes/listing.js");
// const reviewRouter=require("./routes/review.js");
// const userRouter=require("./routes/user.js");

// main().then((res)=>{
//     console.log("connection sucessfully");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// app.get("/",(req,res)=>{
//     res.send("root is working");
// });
 
// const sessionOptions={
//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true,
//     cookie:{
//         express:Date.now() + 7 * 24 *60 *60 * 1000,
//         maxAge:7 * 24 *60 *60 * 1000,
//         httpOnly:true,
//     },
// };
// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     next();
// });
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"Student@gmail.com",
//         username:"Dwai",
//     });
//     let registerednewUser=await User.register(fakeUser,"helloworld");
//     res.send(registerednewUser);
// });

// app.use("/listings",listingRouter);
// app.use("/listings/:id/reviews",reviewRouter);
// app.use("/",userRouter);

// app.all("*",(req,res,next)=>{
// next(new ExpressError(404,"page not found"));
// });
// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="something went wrong"}=err;
//     // res.status(statusCode).send(message);
//     res.status(statusCode).render("error.ejs", { message });
//     //res.render("error.ejs",{message});
// });
// app.listen(8080,()=>{
//     console.log("server is listening 8080");
// }); 
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const mongoose = require('mongoose');
const Listing = require("./models/listing.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const Review = require("./models/reviews.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main().then((res) => {
    console.log("Connection successfully established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req, res) => {
    res.send("Root is working");
});

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "Student@gmail.com",
        username: "Dwai",
    });
    let registerednewUser = await User.register(fakeUser, "helloworld");
    res.send(registerednewUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});



