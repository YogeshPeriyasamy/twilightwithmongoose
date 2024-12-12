 const path=require("path");
 const mongodb=require("mongodb");
 const ObjectId=mongodb.ObjectId;

// connecting model page of sequel with the controller
const Product=require('../model/sequelizingmodel');
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
    const product=new Product(name,price,description,imageURL)
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
            <input type="hidden" name="id" value="${product._id}">
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


// //create a path to the cartmodel
// // const cartmodel_router=require('../model/cartmodel');

// // to add cart product to the backend
// exports.add_cartproduct=(req,res,next)=>{
//     const{id,name,urlInput,price}=req.body;
    
//     // cartmodel_router.add_cart(id,name,urlInput,price)
//     // .then(()=>res.redirect('/twilight/cart'))
//     // .catch(err=>console.log(err));
//     let fetchedcart;
//     let newqty;
//     req.user.getCart()
//     .then(cart => {
//         fetchedcart = cart;
//         return cart.getProducts({ where: { id: id } });
//     })
//     .then(products => {
//         let product;
//         if (products.length > 0) {
//             product = products[0];
//         }
//         if (product) {
//             // If the product exists, increase the quantity
//             let oldqty = product.cartitem.qty; 
//             console.log("oldqty :",oldqty);
//             newqty = oldqty + 1;

//             // Update the existing cart item quantity
//             // return fetchedcart.addProduct(product, { through: { qty: newqty } });
//             return product.cartitem.update({ qty: newqty });
//         } else {
//             // If the product does not exist in the cart, fetch it from the user products
//             return req.user.getProducts({ where: { id: id } });
//         }
//     })
//     .then(products => {
//         if (products) {
//             let product = products[0];
//             // Add the new product to the cart with a quantity of 1
//             return fetchedcart.addProduct(product, { through: { qty: 1 } });
//         }
//     })
//     .then(() => {
//         res.redirect('/twilight/cart');
//     })
//     .catch(err => console.log(err));

// }



// // designing the cart page
// exports.cart_page=async(req,res,next)=>{
// //     const product=await cartmodel_router.getallproducts();
// //    console.log(product);
// //     let cart_products=product.cart_products;
// //     let totalprice=product.totalprice;
// //     let totalproducts=product.totalproducts;
// //     console.log(cart_products,totalprice,totalproducts);
// req.user.getCart()
//     .then(cart => {
//         console.log("Cart:", cart);
//         return cart.getProducts();
//     })
//     .then(products_cart => {
//         // console.log("Products in cart:", products_cart);
//         // let products = products_cart[0];
//         // console.log("First product:", products);
//         console.log(products_cart);
//         let productlistHTML = "";
//         products_cart.forEach(product => {
//             quantity=product.cartitem.qty;
//             productlistHTML += `
//             <li>
//                 <img src="${product.urlInput}" alt="${product.name}">
//                 <h1>${product.name}</h1>
//                 <p>${product.price} Rs</p> 
//                 <p>qty : ${quantity}</p>
//            </li>`;
//         });
//         const html = `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Products list</title>
//              <link rel="stylesheet" href="/navigation.css">
//             <link rel="stylesheet" href="/productsstyles.css">
//         </head>
//         <body>
//         <div class="main_header">
//             <nav class="headers">
//                 <a href="/twilight/home">Home</a>
//                 <a href="/twilight/products">Products</a>
//                 <a href="/twilight/add-product">Add Product</a>
//                 <a href="/twilight/cart">My cart</a>
//                 <a href="/twilight/orders">Orders</a>
//                 <div class="carttotal">
                
//                 </div>
//             </nav>
//         </div>
//         <ul class="product-list">${productlistHTML}</ul>
//         <a href='/twilight/add-product'>Go to add products</a>
//         </body>
//         </html>`;
    
//         res.send(html);
//     })
//     .catch(err => console.log(err));  
// }


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
    const product=new Product(name,price,description,imageURL,new ObjectId(id));
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