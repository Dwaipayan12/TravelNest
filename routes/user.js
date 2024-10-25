const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    try {
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl); 
    }
);

router.get("/logout",(req,res,next)=>{
req.logout((err)=>{
if(err){
    return next(err);
}
req.flash("success","You are log out");
res.redirect("/listings");
});
});
module.exports = router;
