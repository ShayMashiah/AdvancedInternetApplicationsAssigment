const express = require('express');
const router = express.Router();
const Post = require('../controllers/post');



router.post('/', Post.CreateNewPost);

router.get('/', Post.GetAllPosts);

module.exports = router;
