const Messages = require('../models/chat');

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
    try{
    const messages = await Messages.findAll();
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