const express = require('express');
const multer = require('multer');
const router = express.Router();

const auth = require('../middleware/auth')
const chatConttoller = require('../controllers/chat');

// Set up a multer storage engine for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/post-chat', auth.authentication, chatConttoller.storeChat);

router.post('/post-file',  upload.single('file'), auth.authentication, chatConttoller.mediaStore);

router.get('/get-chat/:id', auth.authentication, chatConttoller.getChat);

router.post('/post-group', auth.authentication, chatConttoller.storeGroup);

router.get('/get-groups', auth.authentication, chatConttoller.getGroups);

router.post('/add-user', auth.authentication, chatConttoller.addUser);

router.get('/check-admin/:id', auth.authentication, chatConttoller.checkAdmin);

module.exports = router