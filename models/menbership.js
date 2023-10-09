const  Sequelize  = require('sequelize');
const sequelize = require('../utils/database');

const Membership = sequelize.define('UserGroup', {
    isAdmin: {
        type: Sequelize.BOOLEAN
    }
  
});

module.exports = Membership;