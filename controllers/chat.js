const Messages = require('../models/chat');
const Groups = require('../models/group');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Membership = require('../models/menbership');
const AWS = require('aws-sdk');
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

function uploadToS3(file, fileName) {

    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })


    var params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, res) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(res.Location);
            }
        })
    })

}

const mediaStore = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const fileName = `uploads/${Date.now()}${req.file.originalname}`;
        const fileURL = await uploadToS3(req.file.buffer, fileName);
        await Messages.create({
            messages: fileURL,
            name: req.user.name,
            groupId: groupId,
            userId: req.user.id
        });
        res.status(200).json({ fileURL, success: true });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err, success: false })
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

    const Id = req.user.id;

    // Use the Group model to find all groups associated with the user
    Groups.findAll({
        include: [{
            model: User,
            where: { id: Id },
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
        const users = await User.findAll({
            where: {
                email: userDetails
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No matching users found.' });
        }


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
    mediaStore,
    getChat,
    storeGroup,
    getGroups,
    addUser,
    checkAdmin,
}