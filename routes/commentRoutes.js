const express = require('express');
const router = express.Router();
const Comment = require('../controllers/comments');

router.post('/', Comment.CreateComment);

router.get('/', Comment.GetAllComments);

router.get('/:id', Comment.CommentByPostID);

router.put('/:id', Comment.CommentUpdate);

module.exports = router;