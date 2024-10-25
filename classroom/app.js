const express = require("express");
const app = express();
const session = require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

const sessionOptions={
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());
app.get("/register",(req,res)=>{
let {name="anonymous"}=req.query;
req.session.name=name;
console.log(name);
if(name==="anonymous")
{
   req.flash("error","user not registered");
}
else{
    req.flash("success","user registered successfully!");
}
res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // const successMsg = req.flash("success");
    // res.render("random.ejs", { name: req.session.name, msg: successMsg });
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.render("random.ejs",{name:req.session.name});
});
// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You have sent a request ${req.session.count} times`);
// });

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
