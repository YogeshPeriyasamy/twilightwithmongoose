const express=require("express");
const router=express.Router();
const controller_router=require('../controller/product_controller');
router.get("/home",controller_router.gethome);
router.get("/add-product",controller_router.add_productform);
router.post("/add-product",controller_router.add_product);
router.get("/products",controller_router.showproductlist);

router.get("/product_deatils/:id",controller_router.showproductdetails);
router.post("/addtocart",controller_router.add_cartproduct)
router.get("/cart",controller_router.cart_page);

const path=require("path");
router.get("/edit_product",(req,res)=>{
    res.sendFile(path.join(__dirname,'../view/edit_product.html'));
});

router.get("/geteditproduct/:editid",controller_router.editdetailspage)

router.post("/edit&add-product",controller_router.update_editedproduct);

router.get("/delete_product/:deleteid",controller_router.delete_product)
module.exports=router;