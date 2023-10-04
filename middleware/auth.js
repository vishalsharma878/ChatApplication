const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async (req, res, next) => {
    const token = req.header('Authorization');
    try{
    const user = jwt.verify(token, process.env.JWT_TOKEN);
    
    const userAuth = await User.findByPk(user.userId);
    req.user = userAuth;
    next();
    }
    catch(err) {
        console.log(err)
        res.status(500).json({err});
    }
    
}

module.exports= {
    authentication
}