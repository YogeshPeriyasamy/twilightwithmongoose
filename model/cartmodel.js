// let cart_products=[];
const db = require('../util/database');
let totalprice = 0;
let totalproducts = 0;

// Backend data
async function add_cart(id, name, urlInput, price) {
    let alreadyexist;
    let qty = 0;

    // Check if the product already exists in the cart
    const [existingProduct] = await db.execute('SELECT qty FROM cart WHERE id = ?', [id]);

    if (existingProduct.length > 0) {
        // Product exists, update its quantity
        alreadyexist = existingProduct[0].qty + 1;
        totalprice += parseInt(price);
        totalproducts += 1;
        return db.execute('UPDATE cart SET qty = ? WHERE id = ?', [alreadyexist, id]);
    } else {
        // Product doesn't exist, insert it into the cart
        totalprice += parseInt(price);
        totalproducts += 1;
        return db.execute('INSERT INTO cart (id,name, price, urlInput, qty) VALUES (?,?, ?, ?, ?)', [id,name, price, urlInput, 1]);
    }
}

// To get all the products
function getallproducts() {
    return db.execute('SELECT * FROM cart')
        .then(([rows, field_data]) => {
            return {
                cart_products: rows,
                totalprice: totalprice,
                totalproducts: totalproducts
            };
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            throw error;
        });
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