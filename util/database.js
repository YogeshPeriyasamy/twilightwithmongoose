// const mysql=require("mysql2");
// const pool=mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node_schema',
//     password:'Yogesh@1209'
// });
// module.exports=pool.promise();
const Sequelize=require("sequelize");
const sequelize=new Sequelize('sequelizedatabase','root','Yogesh@1209',{
    dialect:'mysql',
    host:'localhost',
   
})
sequelize.authenticate()
  .then(() => console.log('Connection established successfully.'))
  .catch(err => console.error('Unable to connect:', err));

module.exports=sequelize;