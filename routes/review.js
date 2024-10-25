const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const {isLoggedIn,isreviewAuthor}=require("../middleware.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);  
    if (error) {
        const errMsg = error.details?.map((el) => el.message).join(", ") || 'Validation error';  // Safely map error messages
        throw new ExpressError(400, errMsg);  
    } else {
        next();
    }
}

//Reviews
//Post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success"," new review created!");
    console.log("new Review Saved");
    res.redirect(`/listings/${listing._id}`);
}));
    
    //Delete Review Route
router.delete("/:reviewId", isLoggedIn,isreviewAuthor, wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    await Review.findById(reviewId);
    req.flash("success"," review deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports=router;
