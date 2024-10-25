const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(', ') || 'Validation error';
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  

//index.route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });

}));

//new route
router.get("/new",isLoggedIn,(req,res)=>{
res.render("listings/new");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({path:"reviews",populate:{
            path:"author",
        },
    })
        .populate("owner");
        console.log("Listing found:", listing); 
        if(!listing){
            req.flash("error"," Listing you requested does not exist!");
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show", { listing });
  
    }
));

//create Route
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
const newListing=new Listing(req.body.listing);
newListing.owner=req.user._id;
await newListing.save();
req.flash("success","New listing Created!");
res.redirect("/listings");
}));

//for edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log("Listing found:", listing); 
    if(!listing){
        req.flash("error"," Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit", { listing });

}));
//update
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedListingData = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, updatedListingData);
    req.flash("success"," listing updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete rout
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash("success"," listing Deleted!");
    res.redirect("/listings");
}));
module.exports=router;
