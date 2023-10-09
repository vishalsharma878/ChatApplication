const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const chatConttoller = require('../controllers/chat');


router.post('/post-chat', auth.authentication, chatConttoller.storeChat);
router.get('/get-chat/:id', auth.authentication, chatConttoller.getChat);

router.post('/post-group', auth.authentication, chatConttoller.storeGroup);

router.get('/get-groups', auth.authentication, chatConttoller.getGroups);

router.post('/add-user', auth.authentication, chatConttoller.addUser);

router.get('/check-admin/:id', auth.authentication, chatConttoller.checkAdmin);

module.exports = router