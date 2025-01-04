const express = require('express');
const router = express.Router();
const Post = require('../controllers/post');



router.post('/', Post.CreateNewPost);

router.get('/', Post.GetAllPosts);

router.get('/:id', Post.PostByID);

router.put('/:id', Post.PostUpdate);

router.delete('/:id', Post.PostDelete);

module.exports = router;
