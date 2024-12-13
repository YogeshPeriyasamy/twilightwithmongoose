 const path=require("path");
 const mongodb=require("mongodb");
 const ObjectId=mongodb.ObjectId;


// connecting model page of sequel with the controller
const Product=require('../model/sequelizingmodel');
const User=require('../model/sequelizeusermodel');


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
    // console.log("checking req.user", req.session.userid);
    const product=new Product({
        name:name,
        price:price,
        description:description,
        imageURL:imageURL,
        userId:req.session.userid,
    })
    product.save()
    .then(()=>res.redirect('/twilight/products'))
    .catch((err)=>console.log(err))
    
}

//to go to the productlist page

exports.showproductlist = async(req, res, next) => {
    let productlistHTML = "";
Product.find()//find() is a mongoose given method to fetch all products
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


// to get to product details page
exports.showproductdetails=async(req, res, next) =>{
    
    Product.findById(req.params.id)//findById is a mongoose method the advantage is we dont need to convert the string to object id it do that for us
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
    let user = await User.findById('675ba2148d8b769e77ea072b');
    console.log("to cart add",user);
    user.addandupdatecart(_id)
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
    const user = await User.findById('675ba2148d8b769e77ea072b').populate('cart.items.prodId'); // Populate prodId with product details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Map the cart items to include product details and quantity
    const cartProducts = user.cart.items.map(item => ({
      product: item.prodId, // Populated product details
      quantity: item.quantity, // Quantity from the cart
    }));
    console.log("all cart products",cartProducts);
    let productlistHTML = "";
    cartProducts.forEach(prod => {
            console.log("in loop",prod.product._id);
            productlistHTML += `
            <li>
                <img src="${prod.product.imageURL}" alt="${prod.product.name}">
                <h1>${prod.product.name}</h1>
                <p>${prod.product.price} Rs</p> 
                <p>qty : ${prod.quantity}</p>
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


//to go t the edit details page

exports.editdetailspage=(req,res,next)=>{

    Product.findById(req.params.editid)
    .then(toeditproduct=> res.json(toeditproduct))
    .catch(err=>console.log(err));
   
}

// to update the edited product from the editproduct.html
exports.update_editedproduct=(req,res,next)=>{
    const{name,description,imageURL,price,id}=req.body;
    console.log(name,description,imageURL,price,id);
    Product.findById(id)
    .then((product)=>{
        product.name=name;
        product.description=description;
        product.price=price;
        product.imageURL=imageURL;
        product.userId=req.session.userid;
        return product.save()
    })
    .then((result)=>{
        console.log("product updated");
        res.redirect('/twilight/products');
    })
    .catch(err=>console.log(err));
    
}


// to delete a product
exports.delete_product=(req,res,next)=>{
    const delete_id=req.params.deleteid;
    Product.findByIdAndDelete(delete_id)//method to delete a object
    .then(()=>{
        console.log("its deleted");
        res.redirect('/twilight/products');
})
    .catch(err=>console.log("frontend deleting product",err))
}