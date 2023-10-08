const Messages = require('../models/chat');
const Groups = require('../models/group');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Membership = require('../models/menbership');
const Op = Sequelize.Op;


const storeChat = async (req, res) => {
    const chatMessage = req.body.messageObj.messages;
    const groupId = req.body.groupId;
    try{
    const message = await Messages.create({
        messages: chatMessage, 
        name: req.user.name, 
        userId: req.user.id, 
        groupId: groupId});
    
     res.status(201).json(message);
    }
    catch(err){
        console.log(err);
      res.status(500).json({message: "Internal Server Err"});
    }
    
}

const getChat = async (req, res) => {
    const id = req.params.id;
    
    
    try{
    const messages = await Messages.findAll({where: {groupId: id}});
    res.json({messages, name: req.user.name});
    }
    catch(err) {
        console.log(err);
    }
}

const storeGroup = async (req, res) => {
    try{
    const groupData = req.body;
    const group = await Groups.create(groupData);
    console.log(req.user.id);
    await Membership.create({userId: req.user.id, groupId: group.dataValues.id})
    res.status(201).json({message: "Group created sucessfully", group});
     }catch(err) {
        res.status(500).json({message: "Not able to create group"});
    }
}

const getGroups = (req, res) => {
    // Assume you have the user's ID
const Id = req.user.id; // Replace with the actual user ID you want to query

// Use the Group model to find all groups associated with the user
Groups.findAll({
    include: [{
        model: User,
        where: { id: Id }, // Filter by the user's ID
        through: Membership, // Include the Membership model to get the associations
    }],
})
    .then(groups => {
        if (groups) {
            res.status(200).json({group: groups});
        } else {
            console.log('No groups found for the user.');
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({message: 'Error retrieving groups for the user'})
    });

}

const addUser = async (req, res) => {
    const email = req.body.email;
    const id = req.body.groupId;
    try{
        const user = User.findOne({where: {email: email}});
        if(user){
          await Membership.create({userId: req.user.id, groupId: id});
          res.status(201).json({message: "User added sucessfully", group});
        }
        
         }catch(err) {
            console.log(err);
            res.status(500).json({message: "Email is not valid"});
        }
    
}
module.exports = {
    storeChat,
    getChat,
    storeGroup, 
    getGroups,
    addUser
}