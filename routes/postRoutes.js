const express = require('express');
const router = express.Router();
const Post = require('../controllers/post');



router.post('/', Post.CreateNewPost);

module.exports = router;
