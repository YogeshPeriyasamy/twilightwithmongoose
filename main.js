const express = require("express");
const http=require("http");
console.log(http);
const path = require("path");
const {mongoconnect}=require('./util/database');
const app = express();
const User=require('./model/sequelizeusermodel');
const session=require('express-session');


app.use(session({
    secret: "loginkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
    }
}))


//middleware to parse the body ,from form to req.body as key value pair
app.use(express.urlencoded({ extended: true }));

//create a static directory for the css the absolute path
app.use(express.static(path.join(__dirname, 'public')));

//to add a user

app.use(async (req, res, next) => {
    try {
        let user = await User.findById('675a7a1dfa7fe799b083f531');
        if (!user) {
            const usera = new User("viki", "viki@gmail.com",{items:[]},null);
            user = await usera.save();
            console.log("New user created:", user);
        }

        req.session.userid = user._id;

        // Wrap session.save() in a promise
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) return reject(err);
                console.log("Session saved successfully");
                resolve();
            });
        });

        next(); // Continue to the next middleware or route
    } catch (err) {
        console.error("Error in session handling middleware:", err);
        next(err); // Pass the error to the error-handling middleware
    }
});



//create a roouter path 
const router_path = require('./router/product_router');
app.use("/twilight", router_path);



mongoconnect(()=>{
   
    app.listen(3000,()=>{
        console.log("server started");
    });
})


