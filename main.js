const express = require("express");
const http=require("http");
console.log(http);
const path = require("path");
const {mongoconnect}=require('./util/database');
const app = express();
const User=require('./model/sequelizeusermodel');


//middleware to parse the body ,from form to req.body as key value pair
app.use(express.urlencoded({ extended: true }));

//create a static directory for the css the absolute path
app.use(express.static(path.join(__dirname, 'public')));

//to add a user

app.use((req,res,next)=>{
    User.findById('675947efa9f40f3be1bf0cf4')
    .then((user)=>{
        if(user){
            req.user=user;
            console.log("current user",req.user)
        }
        else{
            const usera=new User("viki","viki@gmail.com");
            usera.save()
            .then(result=>console.log(result))
            .catch(err=>console.log(err))
        }
    })
    .catch(err=>console.log(err))
    
    next();
})


//create a roouter path 
const router_path = require('./router/product_router');
app.use("/twilight", router_path);



mongoconnect(()=>{
   
    app.listen(3000,()=>{
        console.log("server started");
    });
})


