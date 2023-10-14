const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const archivedChat = sequelize.define('archivedchat', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        alowNull: false
    },
    name: Sequelize.STRING,
    messages: Sequelize.STRING,
   

})

module.exports = archivedChat;