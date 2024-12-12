const Mongodb=require('mongodb');
const ObjectId= Mongodb.ObjectId;
const {getdb}=require('../util/database');
class Product{
     constructor(name,price,description,imageURL,id,userid){
        this.name=name;
        this.price=price;
        this.description=description;
        this.imageURL=imageURL;
        this._id=id;
        this.userid=userid;
     }

     //function to inset data into database
     save(){
        const db=getdb();
        let dbOP;
        console.log(this);
        if(this._id){
           dbOP=db.collection('products').updateOne({_id:new ObjectId(this._id)},{$set:this});
        }
        else{
            dbOP=db.collection('products').insertOne(this)
        }
         return dbOP
         .then(result=>{
            console.log(result);
         })
         .catch(err=>{
            console.log("while adding product",err);
         })
     }

     //method to fetch all the products
     static fetchAll(){
        const db=getdb();
        return db.collection('products').find().toArray()
        .then((allproducts)=>{
            console.log(allproducts);
            return allproducts;
        })
        .catch(err=>{
            console.log("while fetching products",err);
        })
     }

     // to find by id
     static findbyid(prodid){
        const db=getdb();
        console.log(prodid,new ObjectId(prodid));
        return db.collection('products').find({ _id:new ObjectId(prodid) })
        .next()
        .then(product=>{
            console.log(product);
            return product;
        })
        .catch(err=>{
            console.log("getting a product by id",err);
        })
     }

     // to delete with id
     static deletebyid(prodid){
        const db=getdb();
        return db.collection('products').deleteOne({_id:new ObjectId(prodid)})
        .then(result=>{
            console.log("deleted")
        })
        .catch(err=>{
            console.log("while deleting",err)
        })
     }
}


module.exports=Product;