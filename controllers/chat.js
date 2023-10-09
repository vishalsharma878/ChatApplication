const Messages = require('../models/chat');
const Groups = require('../models/group');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Membership = require('../models/menbership');
const Op = Sequelize.Op;


const storeChat = async (req, res) => {
    const chatMessage = req.body.messageObj.messages;
    const groupId = req.body.groupId;
    try {
        const message = await Messages.create({
            messages: chatMessage,
            name: req.user.name,
            userId: req.user.id,
            groupId: groupId
        });

        res.status(201).json(message);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Err" });
    }

}

const getChat = async (req, res) => {
    const id = req.params.id;

    try {
        const messages = await Messages.findAll({ where: { groupId: id } });
        res.json({ messages, name: req.user.name });
    }
    catch (err) {
        console.log(err);
    }
}

const storeGroup = async (req, res) => {
    try {
        const groupData = req.body;
        const group = await Groups.create(groupData);
        console.log(req.user.id);
        await Membership.create({ userId: req.user.id, groupId: group.dataValues.id, isAdmin: true })
        res.status(201).json({ message: "Group created sucessfully", group });
    } catch (err) {
        res.status(500).json({ message: "Not able to create group" });
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
                res.status(200).json({ group: groups });
            } else {
                console.log('No groups found for the user.');
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving groups for the user' })
        });

}

const addUser = async (req, res) => {
    const { groupId, userDetails } = req.body;

    try {
        // Use Sequelize to retrieve user records based on the provided details
        const users = await User.findAll({
            where: {
                email: userDetails // Adjust the field (e.g., email) as needed
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No matching users found.' });
        }

        // Add the valid user records to the group
        const group = await Groups.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        await group.addUsers(users);

        return res.status(200).json({ message: 'Members added to the group successfully.' });
    } catch (error) {
        console.error('Error adding members to the group:', error);
        return res.status(500).json({ message: 'An error occurred while adding members to the group.' });
    }

}

const checkAdmin = async (req, res) => {
    const id = req.params.id;
    try {
        const admin = await Membership.findOne({ where: { userId: req.user.id, groupId: id } });
        const isadmin = admin.dataValues.isAdmin;
        if (isadmin == null) {
            return res.status(200).json({ isAdmin: false });
        }
        res.status(200).json({ isAdmin: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    storeChat,
    getChat,
    storeGroup,
    getGroups,
    addUser,
    checkAdmin,
}