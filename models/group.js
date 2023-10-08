const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const group = sequelize.define('groups', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        alowNull: false
    },
    groupname: Sequelize.STRING, 

})

module.exports = group;