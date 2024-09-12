let cart_products=[];
let totalprice=0;
let totalproducts=0;
//backend data
function add_cart(id,name,urlInput,price){
    let product;
    let qty=0;
    let alreadyexist=cart_products.findIndex(ele=>ele.id==id);
    //console.log(alreadyexist,cart_products[alreadyexist].qty);
    if(alreadyexist!==-1)
    {
        cart_products[alreadyexist].qty+=1;
        totalprice += parseInt(price);
    }
    else{
        qty=1;
        product={id,name,urlInput,price: parseInt(price),qty};
        cart_products.push(product);
        totalprice =(totalprice+ product.price);
    }
    
    
    totalproducts+=1;
    console.log(product,totalprice,totalproducts);
}

// to get all the products
function getallproducts()
{
    return ({cart_products,totalprice,totalproducts});
}

// to delete a product from the cart
function delete_product(deleteid){
    const is_presentindex=cart_products.findIndex(product=>parseInt(product.id)==parseInt(deleteid))
    if(is_presentindex==-1){
        return;
    }
    totalprice=totalprice-((cart_products[is_presentindex].price)*(cart_products[is_presentindex].qty));
    totalproducts=totalproducts-cart_products[is_presentindex].qty;
    let postdelete=cart_products.filter(product=>parseInt(product.id)!==parseInt(deleteid));
    cart_products=postdelete;
    return ;
}
module.exports={add_cart,getallproducts,delete_product};