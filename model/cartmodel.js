let cart_products=[];
let totalprice=0;
let totalproducts=0;
//backend data
function add_cart(id,name,urlInput,price){
    
    let qty=0;
    let alreadyexist=cart_products.findIndex(ele=>ele.id===parseInt(id));
    if(alreadyexist!=-1)
    {
        qty=cart_products[alreadyexist].qty+1;
    }
    else{
        qty=qty+1;
    }
    let product={id,name,urlInput,price: parseInt(price),qty};
    cart_products.push(product);
    totalprice =(totalprice+ product.price);
    totalproducts+=1;
    console.log(product,totalprice,totalproducts);
}

// to get all the products
function getallproducts()
{
    return ({cart_products,totalprice,totalproducts});
}
module.exports={add_cart,getallproducts};