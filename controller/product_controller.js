 const path=require("path");
 const mongodb=require("mongodb");
 const ObjectId=mongodb.ObjectId;


// connecting model page of sequel with the controller
const Product=require('../model/sequelizingmodel');
const User=require('../model/sequelizeusermodel');
// const { where } = require("sequelize");

exports.gethome=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../view/home.html'));
}

//controller to add product form

exports.add_productform=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../view/add_product.html'));
}

//add product to backend
exports.add_product=(req,res,next)=>{
    const{name,description,imageURL,price}=req.body;
    //console.log(name,description,imageURL,price);
    console.log("checking req.user", req.session.userid);
    const product=new Product(name,price,description,imageURL,null, req.session.userid)
    product.save()
    .then(()=>res.redirect('/twilight/products'))
    .catch((err)=>console.log(err))
    
}

//to go to the productlist page

exports.showproductlist = async(req, res, next) => {
    let productlistHTML = "";
Product.fetchAll()
.then(rows=>{
     const products = rows;
  
    products.forEach(product => {
        productlistHTML += `
        <li>
            <img src="${product.imageURL}" alt="${product.name}">
            <h1>${product.name}</h1>
            <p>${product.price} Rs</p> 
            <a href="/twilight/product_deatils/${product._id}">Details</a>
            <a href="/twilight/edit_product?editid=${product._id}">Edit product</a>
        </li>`;
    });
    


    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Products list</title>
         <link rel="stylesheet" href="/navigation.css">
        <link rel="stylesheet" href="/productsstyles.css">
    </head>
    <body>
    <div class="main_header">
        <nav class="headers">
            <a href="/twilight/home">Home</a>
            <a href="/twilight/products">Products</a>
            <a href="/twilight/add-product">Add Product</a>
            <a href="/twilight/cart">My cart</a>
            <a href="/twilight/orders">Orders</a>
        </nav>
    </div>
    <ul class="product-list">${productlistHTML}</ul>
    <a href='/twilight/add-product'>Go to add products</a>
    </body>
    </html>`;

    res.send(html);
})
.catch(err=>console.log(err))

};


// // to get to product details page
exports.showproductdetails=async(req, res, next) =>{
    
    Product.findbyid(req.params.id)
    .then(data=>{
       let product=data
       //console.log("frrororonnrnnnbsbsb",product);
       if(product){
        const html=`
         <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Products details</title>
         <link rel="stylesheet" href="/navigation.css">
        <link rel="stylesheet" href="/productdetails.css">
    </head>
    <body>
    <div class="main_header">
        <nav class="headers">
            <a href="/twilight/home">Home</a>
            <a href="/twilight/products">Products</a>
            <a href="/twilight/add-product">Add Product</a>
            <a href="/twilight/cart">My cart</a>
            <a href="/twilight/orders">Orders</a>
        </nav>
    </div>
    <div class="product_list">
        <img src="${product.imageURL}" alt="${product.name}">
        <h1><strong>Name:</strong>${product.name}</h1>
        <p><strong>Description:</strong>${product.description}</p> 
        <p><strong>Price:</strong>${product.price} Rs</p>
        <form action="/twilight/addtocart" method="post">
            <input type="hidden" name="_id" value="${product._id}">
            <input type="hidden" name="urlInput" value="${product.imageURL}">
            <input type="hidden" name="price" value="${product.price}">
            <input type="hidden" name="name" value="${product.name}">
            <button class="btn"> Add to cart<button>
            <button type="button" onclick="window.location.href='/twilight/delete_product/${product._id}'">Delete</button>
        </form>    
    </div>
    </body>
    </html>
    `;
    res.send(html);
    }
    else{
        res.status(404).send("page not found");
    }
    })
    .catch(err=>console.log("fetching with id",err))
   
}


 // to add cart product to the backend
exports.add_cartproduct=async(req,res,next)=>{
    const{_id,name,urlInput,price}=req.body;
    console.log("product to cart",_id);
    let user = await User.findById('675a7a1dfa7fe799b083f531');
    console.log("to cart add",user);
    let newuserinstance=await new User(user.name,user.email,user.cart,user._id);
    newuserinstance.addandupdatecart(_id)
    .then((result)=>{
        console.log("product added");
        res.redirect('/twilight/cart')
    })
    .catch(err=>{
        console.log(err);
    })
}

//Controller function to get cart products for a specific user
exports.getCartProducts = async (req, res) => {
  try {
    // const userId = req.params.userId; // Assume user ID is passed in the route parameter

    // Fetch the user with their cart details
    const user = await User.findById('675a7a1dfa7fe799b083f531'); // Adjust if using a custom method for User
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productIds = user.cart.items.map(item => item.prodId);

    // Fetch the products that match the IDs
    const db = require('../util/database').getdb();
    const products = await db
      .collection('products')
      .find({ _id: { $in: productIds.map(id => new ObjectId(id)) } })
      .toArray();

    // Attach quantities to the products
    const cartProducts = products.map(product => {
      const cartItem = user.cart.items.find(item => item.prodId.toString() === product._id.toString());
      return {
        ...product,
        quantity: cartItem.quantity,
      };
    });

    //console.log("all cart products",cartProducts);
    let productlistHTML = "";
    cartProducts.forEach(product => {
            console.log("in loop",product._id);
            productlistHTML += `
            <li>
                <img src="${product.imageURL}" alt="${product.name}">
                <h1>${product.name}</h1>
                <p>${product.price} Rs</p> 
                <p>qty : ${product.quantity}</p>
           </li>`;
        });
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Products list</title>
             <link rel="stylesheet" href="/navigation.css">
            <link rel="stylesheet" href="/productsstyles.css">
        </head>
        <body>
        <div class="main_header">
            <nav class="headers">
                <a href="/twilight/home">Home</a>
                <a href="/twilight/products">Products</a>
                <a href="/twilight/add-product">Add Product</a>
                <a href="/twilight/cart">My cart</a>
                <a href="/twilight/orders">Orders</a>
                <div class="carttotal">
                
                </div>
            </nav>
        </div>
        <ul class="product-list">${productlistHTML}</ul>
        <a href='/twilight/add-product'>Go to add products</a>
        </body>
        </html>`;
    
        res.send(html);
  } catch (error) {
    console.error('Error fetching cart products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// //to go t the edit details page

exports.editdetailspage=(req,res,next)=>{

    Product.findbyid(req.params.editid)
    .then(toeditproduct=> res.json(toeditproduct))
    .catch(err=>console.log(err));
   
}

// // to update the edited product from the editproduct.html
exports.update_editedproduct=(req,res,next)=>{
    const{name,description,imageURL,price,id}=req.body;
    console.log(name,description,imageURL,price,id);
    const product=new Product(name,price,description,imageURL,new ObjectId(id), req.session.userid);
    product.save()
    .then((result)=>{
        console.log("product updated");
        res.redirect('/twilight/products');
    })
    .catch(err=>console.log(err));
    
}


// // to delete a product
exports.delete_product=(req,res,next)=>{
    const delete_id=req.params.deleteid;
    Product.deletebyid(delete_id)
    .then(()=>{
        console.log("its deleted");
        res.redirect('/twilight/products');
})
    .catch(err=>console.log("frontend deleting product",err))
}