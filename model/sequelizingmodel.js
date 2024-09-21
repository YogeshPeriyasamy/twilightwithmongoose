const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const product=sequelize.define('products',{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true 
    },
    name : {
        type: Sequelize.STRING,
        allowNull:false
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type: Sequelize.STRING,
        allowNull:false
    },
    urlInput:{
        type: Sequelize.STRING,
        allowNull:false
    }

})
module.exports=product;