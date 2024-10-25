const express=require("express");
const app=express();


const cookieParse=require("cookie-parser");
app.use(cookieParse("secretcode"));

app.get("/getcookies",(req,res)=>{
res.cookie("made-in","India",{signed:true});
res.send("signed cookie sent");
});

app.get("/verify",(req,res)=>{
// console.log(req.cookies);
console.log(req.signedCookies);
res.send("verified");
});
app.get("/setcookies",(req,res)=>{
res.cookie("greet","namaste");
res.cookie("origin","India");
res.cookie("Dwaipayan","Bhowmik");
res.send("we sent you a cookie");
});

app.get("/greet",(req,res)=>{
let {name="anonymous"}=req.cookies;
res.send(`i am ${name}`);
});
app.get("/",(req,res)=>{
res.send("localhost started");
console.dir(req.cookies);
});

app.listen(8080,()=>{
    console.log("server is listening 8080");
}); 