const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const chatConttoller = require('../controllers/chat');


router.post('/post-chat', auth.authentication, chatConttoller.storeChat);
router.get('/get-chat', auth.authentication, chatConttoller.getChat);


module.exports = router