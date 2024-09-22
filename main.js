const express = require("express");
const path = require("path");
const app = express();

//create a database 
const sequelize=require('./util/database')
const productdb = require('./model/sequelizingmodel');
const userdb=require('./model/sequelizeusermodel');
const cart=require('./model/sequelizecartmodel');
const cartitem=require('./model/sequelizecartitemmodel');
//middleware to parse the body ,from form to req.body as key value pair
app.use(express.urlencoded({ extended: true }));

//create a static directory for the css the absolute path
app.use(express.static(path.join(__dirname, 'public')));



//creaating a middleware to send the user to the products
app.use((req,res,next)=>{
    userdb.findByPk(1)
    .then(user=>{
        // console.log("user form db",user);
        req.user=user;
        next();
    })
    .catch(err=>console.log(err))
})


//create a roouter path 
const router_path = require('./router/product_router');
app.use("/twilight", router_path);



productdb.belongsTo(userdb);
userdb.hasMany(productdb);
userdb.hasOne(cart);
cart.belongsTo(userdb);
cart.belongsToMany(productdb,{through:cartitem});
productdb.belongsToMany(cart,{through:cartitem});


sequelize.sync({force:true})
.then(res=>{
    return userdb.findByPk(1)
})
.then(user=>{
    if(!user){
        return userdb.create({
            name:"yogesh",
            email:"yogi11sri@gmail.com"
        })
    }
    return user;
})
.then(user=>{
    console.log("user has been created");
    //to create a cart for the user
    return user.createCart()
    
})
.then(cart=>{
    app.listen(3000,'0.0.0.0');
})
.catch(err=>console.log(err))
//start the server
// app.listen(3000, () => {
//     console.log("server started at 3000")
// });