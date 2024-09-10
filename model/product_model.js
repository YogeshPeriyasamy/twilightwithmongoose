let products=[];

// to add product to the backend
function add_product(name,description,urlInput,price){
    let id=products.length+1;
    let product={id,name,description,urlInput,price};
    products.push(product);
    return product;
}

//to get all the products
function getallproducts(){
    return products;
}

//to get the product details with id
function getproductbyid(id){
return products.find(product=>product.id===parseInt(id)); 
}

module.exports={add_product,getallproducts,getproductbyid}