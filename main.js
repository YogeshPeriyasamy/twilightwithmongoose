const express=require("express");
const path=require("path");
const app=express();

//middleware to parse the body ,from form to req.body as key value pair
app.use(express.urlencoded({extended:true}));

//create a static directory for the css the absolute path
app.use(express.static(path.join(__dirname,'public')));

//create a roouter path 
const router_path=require('./router/product_router');

app.use("/twilight",router_path);

//start the server
app.listen(3000,()=>{
    console.log("server started at 3000")
});