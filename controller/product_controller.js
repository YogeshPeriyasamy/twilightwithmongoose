const path=require("path");
 
//creating a model routes
const model_router=require('../model/product_model');

exports.gethome=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../view/home.html'));
}

//controller to add product form

exports.add_productform=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../view/add_product.html'));
}

//add product to backend
exports.add_product=(req,res,next)=>{
    const{name,description,urlInput,price}=req.body;
    model_router.add_product(name,description,urlInput,price);
    res.redirect('/twilight/products');
}

//to go to the productlist page

exports.showproductlist = (req, res, next) => {
    const products = model_router.getallproducts();
    let productlistHTML = "";
    products.forEach(product => {
        productlistHTML += `
        <li>
            <img src="${product.urlInput}" alt="${product.name}">
            <h1>${product.name}</h1>
            <p>${product.price} Rs</p> 
            <a href="/twilight/product_deatils/${product.id}">Details</a>
            <a href="/twilight/edit_product?editid=${product.id}">Edit product</a>
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
};


// to get to product details page
exports.showproductdetails=(req, res, next) =>{
    const product=model_router.getproductbyid(req.params.id);
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
        <img src="${product.urlInput}" alt="${product.name}">
        <h1><strong>Name:</strong>${product.name}</h1>
        <p><strong>Description:</strong>${product.description}</p> 
        <p><strong>Price:</strong>${product.price} Rs</p>
        <form action="/twilight/addtocart" method="post">
            <input type="hidden" name="id" value="${product.id}">
            <input type="hidden" name="urlInput" value="${product.urlInput}">
            <input type="hidden" name="price" value="${product.price}">
            <input type="hidden" name="name" value="${product.name}">
            <button class="btn"> Add to cart<button>
            <button type="button" onclick="window.location.href='/twilight/delete_product/${product.id}'">Delete</button>
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
}


//create a path to the cartmodel
const cartmodel_router=require('../model/cartmodel');
// to add cart product to the backend
exports.add_cartproduct=(req,res,next)=>{
    const{id,name,urlInput,price}=req.body;
    console.log(id,name,urlInput,price);
    cartmodel_router.add_cart(id,name,urlInput,price);
    res.redirect('/twilight/cart');
}

// designing the cart page
exports.cart_page=(req,res,next)=>{
    const product=cartmodel_router.getallproducts();
   
    let cart_products=product.cart_products;
    let totalprice=product.totalprice;
    let totalproducts=product.totalproducts;
    console.log(cart_products,totalprice,totalproducts);
    let productlistHTML = "";
    cart_products.forEach(product => {
        productlistHTML += `
        <li>
            <img src="${product.urlInput}" alt="${product.name}">
            <h1>${product.name}</h1>
            <p>${product.price} Rs</p> 
            <p>qty : ${product.qty}</p>
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
            <p>Total price : ${totalprice}</p>
            <p>Total products : ${totalproducts}</p>
            </div>
        </nav>
    </div>
    <ul class="product-list">${productlistHTML}</ul>
    <a href='/twilight/add-product'>Go to add products</a>
    </body>
    </html>`;

    res.send(html);
}


//to go t the edit details page

exports.editdetailspage=(req,res,next)=>{
    const toeditproduct=model_router.getproductbyid(req.params.editid);
    res.json(toeditproduct);
   
}

// to update the edited product from the editproduct.html
exports.update_editedproduct=(req,res,next)=>{
    const{name,description,urlInput,price,id}=req.body;
    model_router.edit_product(name,description,urlInput,price,id)
    res.redirect('/twilight/products');
}


// to delete a product
exports.delete_product=(req,res,next)=>{
    const delete_id=req.params.deleteid;
    model_router.delete_product(delete_id);
    cartmodel_router.delete_product(delete_id);
    res.redirect('/twilight/products');
}