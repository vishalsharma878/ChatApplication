const User = require('../models/user')
const bcrypt = require('bcrypt')

const signupData = async (req, res) => {
    try{
     const userData = req.body;
     const password = req.body.password;
     const hashPassword = await bcrypt.hash(password, 10);
     userData.password = hashPassword;
     const user = await User.create(userData);
     res.status(201).json({message: "Sign-up success, You can login now"});
    }
     catch(err){
        res.status(500).json({message: "Internal server error"});
     }
}


module.exports = {
    signupData,
}