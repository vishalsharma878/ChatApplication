const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const user = sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        alowNull: false
     },
     name:{
        type: Sequelize.STRING,
        alowNull: false, 
     },
     email:{
        type: Sequelize.STRING,
        alowNull: false,
        unique: true
     },
     mobile: Sequelize.BIGINT,
     password:{
         type: Sequelize.STRING,
         alowNull: false
     },
 
 });
 
 module.exports = user;