const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async (req, res, next) => {
    const token = req.header('Authorization');
    try{
    const userId = jwt.verify(token, process.env.JWT_TOKEN);
    
    const user = await User.findByPk({where: {id: userId.id}})
    req.user = user;
    next();
    }
    catch(err) {
        res.status(500).json({err});
    }
    
}

module.exports= {
    authentication
}