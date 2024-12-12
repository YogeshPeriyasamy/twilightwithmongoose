// const mysql=require("mysql2");
// const pool=mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node_schema',
//     password:'Yogesh@1209'
// });
// module.exports=pool.promise();


//sequeize connection
// const Sequelize=require("sequelize");
// const sequelize=new Sequelize('sequelizedatabase','root','Yogesh@1209',{
//     dialect:'mysql',
//     host:'localhost',
   
// })
// sequelize.authenticate()
//   .then(() => console.log('Connection established successfully.'))
//   .catch(err => console.error('Unable to connect:', err));

// module.exports=sequelize;



//mongodb connection
const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let _db;
const mongoconnect=(callback)=>{
  if(_db){
    
    callback(_db);
  }
  else{
    MongoClient.connect('mongodb+srv://twilight:JWyekxCeYsAzdE6d@twilightcluster0.2juf0.mongodb.net/shop?retryWrites=true&w=majority&appName=twilightcluster0')
  .then(client=>{
    console.log("mongodb database connected");
    //db() is inbuild function that helps to specify the database name 
    _db=client.db();
    callback(_db);
  })
  .catch(err=>console.log("while establishing database connection",err))
  }
  
}

//method to export the persistent connection
const getdb=()=>{
  if(_db){
    console.log("connecting with old database");
    return _db;// return the existing connection
  }
  console.log("db not found");
}

module.exports={mongoconnect,getdb};




