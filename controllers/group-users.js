const Groups = require('../models/group');
const User = require('../models/user');
const Membership = require('../models/menbership');


const getGroupUsers = async (req, res) => {
  const Id = req.params.id;

  try {
    const group = await Groups.findByPk(Id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Use the `getUsers` association method to retrieve users for the group
    const users = await group.getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users for the group:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving users for the group.' });
  }
}

const removeUserFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  try {

    // Check if the user who is making the change is an admin
    const isAdmin = await Membership.findOne({
      where: {
        groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    await Membership.destroy({ where: { groupId: groupId, userId: userId } });

    return res.status(200).json({ message: 'User removed from the group successfully.' });
  } catch (error) {
    console.error('Error removing user from the group:', error);
    return res.status(500).json({ message: 'An error occurred while removing the user from the group.' });
  }
}

const makeUserAdmin = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;
  try {
    // Check if the user who is making the change is an admin
    const isAdmin = await Membership.findOne({
      where: {
        groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    await Membership.update(
      { isAdmin: true },
      {
        where: {
          groupId,
          userId: userId,
        },
      }
    );

    return res.status(200).json({ message: 'User is now an admin.' });
  } catch (error) {
    console.error('Error making user an admin:', error);
    return res.status(500).json({ message: 'An error occurred while making the user an admin.' });
  }
}

module.exports = {
  removeUserFromGroup,
  getGroupUsers,
  makeUserAdmin
}
