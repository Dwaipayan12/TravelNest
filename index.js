const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
// app.use(expressLayouts);
const Review=require("./models/reviews.js");
const listings=require("./routes/listing.js");

main().then((res)=>{
    console.log("connection sucessfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.get("/",(req,res)=>{
    res.send("root is working");
});

const validateListing=(req,res,next)=>{
    let error = listingSchema.validate(req.body);
    console.log(error);
    if(error)
        {
            //let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);  // Destructure to get error
    if (error) {
        const errMsg = error.details?.map((el) => el.message).join(", ") || 'Validation error';  // Safely map error messages
        throw new ExpressError(400, errMsg);  // Pass the formatted message
    } else {
        next();
    }
}

// app.get("/testListing",async (req,res)=>{
// let simpleListing = new Listing({
//     title:"My new House",
//     description:"By the beach",
//     price:1200,
//     location:"digha",
//     country:"India",
// });
// await simpleListing.save();
// console.log("Sample was saved");
// res.send("successful send");
// });
app.use("/listings",listings);
//index.route
app.get("/testListing", wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
   
}));

//new roue
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});
//create route
app.post("/listings",wrapAsync(async (req, res) => {
    //let(title,description,image,price,country,location)=req.body;
//let listing=await req.body.listing;
//console.log(listing);
// if(!req.body.listing)
//     {
//         next(new ExpressError(404,"send valid data"));  
//     }
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/testListing");
}));

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        console.log("Listing found:", listing); // Log the retrieved listing object
        res.render("listings/show", { listing });
  
    }
));
//for edit
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        console.log("Listing found:", listing); // Log the retrieved listing object
        res.render("listings/edit", { listing });
   
}));

app.put("/listings/:id",  wrapAsync(async (req, res) => {
        let { id } = req.params;
        const updatedListingData = { ...req.body.listing };
        await Listing.findByIdAndUpdate(id, updatedListingData);
        res.redirect("/testListing");
    
}));

//Delete rout
// DELETE route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log("Deleted listing:", deletedListing);
        res.redirect("/testListing");
  
}));

//Reviews
//Post Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
let listing = await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();
console.log("new Review Saved");
res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
let {id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
await Review.findByIdAndDelete(reviewId);
await Review.findById(reviewId);
res.redirect(`/listings/${id}`);
}));
// app.use((err, req, res, next) => {
//     // Handle specific types of errors, like ValidationError
//     if (err.name === 'ValidationError') {
//         //return res.status(400).json({ error: err.message });
//         res.send("it something wrong");
//     }
//     // Handle other types of errors
//     //res.status(500).json({ error: 'Something went wrong' });
//     res.send("it something wrong1");

// });
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
    //res.render("error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("server is listening 8080");
}); 