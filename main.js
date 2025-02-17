const express = require("express");

const path = require("path");
//const {mongoconnect}=require('./util/database');
const mongoose=require('mongoose');
const app = express();
const User=require('./model/sequelizeusermodel');
const session=require('express-session');
require('dotenv').config({ path: './util/.env' });

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
        let user = await User.findById('6763ba5346bff5a1f92e86d6');
        if (!user) {
            const usera = new User({
                name:"siva",
                email:"siva@gmail.com",
                cart:{
                    items:[]
                }
            });
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



mongoose.connect(process.env.MongoConnect)
.then(result=>{
   
    app.listen(3000,()=>{
        console.log("database connected");
        
    });
})
.catch(err=>{
    console.log("error in database connection",err);
})
// Monitor connection status
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose: Database connected successfully.');
});

db.on('error', (err) => {
    console.error('Mongoose: Connection error:', err);
});

db.on('disconnected', () => {
    console.log('Mongoose: Database disconnected.');
});

