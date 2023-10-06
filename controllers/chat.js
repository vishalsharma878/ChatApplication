const Messages = require('../models/chat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const storeChat = async (req, res) => {
    const chatMessage = req.body;
    console.log(chatMessage);
    chatMessage['userId'] = req.user.id;
    chatMessage['name'] = req.user.name;
    try{
    const message = await Messages.create(chatMessage);
     res.status(201).json(message);
    }
    catch(err){
        console.log(err);
      res.status(500).json({message: "Internal Server Err"});
    }
    
}

const getChat = async (req, res) => {
    const length = req.params.length;
    
    
    try{
    const messages = await Messages.findAll({where: {id: {[Op.gt]: length}}});
    console.log(messages)
    res.json({messages, name: req.user.name});
    }
    catch(err) {
        console.log(err);
    }
}
module.exports = {
    storeChat,
    getChat
}