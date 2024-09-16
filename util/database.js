const mysql=require("mysql2");
const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node_schema',
    password:'Yogesh@1209'
});
module.exports=pool;