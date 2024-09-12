let products=[{
    id: 1,
    name: 'coin ',
    description: 'gold one with prehistoric value',
    urlInput: 'https://images.unsplash.com/photo-1641197408799-262f1f343cc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvaW58ZW58MHx8MHx8fDA%3D',
    price: '19000'
  },{
    id: 2,
    name: 'silver coin',
    description: 'silver coin with the great roman history',
    urlInput: 'https://media.istockphoto.com/id/172188284/photo/five-shilling-coin.webp?a=1&b=1&s=612x612&w=0&k=20&c=2BzWlLvA3SdkeJvEMK_8VVr-UKp1dp0PDQ9_H8ncPug=',
    price: '15000'
  }];

// to add product to the backend
function add_product(name,description,urlInput,price){
    let id=products.length+1;
    let product={id,name,description,urlInput,price};
    console.log(product);
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

function edit_product(name,description,urlInput,price,id){
    const editedproductindex=products.findIndex(product=>parseInt(product.id)===parseInt(id));
    console.log("edited index" ,editedproductindex);
    products[editedproductindex].name=name;
    products[editedproductindex].description=description;
    products[editedproductindex].urlInput=urlInput;
    products[editedproductindex].price=price;
    return
}

// t0 delete a product from products
function delete_product(deleteid){
    let postdelete=products.filter(product=>parseInt(product.id)!==parseInt(deleteid));
    products=postdelete;
    return ;
}

module.exports={add_product,getallproducts,getproductbyid,edit_product,delete_product}