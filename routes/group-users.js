const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const groupConttoller = require('../controllers/group-users');

router.get('/get-group-users/:id', groupConttoller.getGroupUsers);

router.delete('/remove-user/:groupId/:userId', auth.authentication, groupConttoller.removeUserFromGroup);

router.put('/make-user-admin/:groupId/:userId', auth.authentication, groupConttoller.makeUserAdmin);

module.exports = router;