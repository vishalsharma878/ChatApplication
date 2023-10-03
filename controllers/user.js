const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

function generateWebToken(id){
    return jwt.sign({userId: id}, process.env.JWT_TOKEN);
}

const loginData = async(req, res) => {
    try{
    const userData = req.body;
    const password = req.body.password;
    const user  = await User.findOne({where: {email: req.body.email}})

    if(!user){
       return res.status(404).json({message: "Invalid email, Please enter the correct email"}) 
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
       return res.status(401).json({message: "Invalid password, please enter corrrect passsword"})
    }
    res.status(200).json({ message: 'Login successful', token: generateWebToken(user.id)});
 }
 catch(err){
    res.status(500).json({message: "Somthing went wrong"})
 }
}

module.exports = {
    signupData,
    loginData
}