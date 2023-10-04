const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const chat = sequelize.define('chat', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        alowNull: false
    },
    name: Sequelize.STRING,
    messages: Sequelize.STRING,
   

})

module.exports = chat;