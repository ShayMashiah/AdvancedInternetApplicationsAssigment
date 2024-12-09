const express = require('express');
const router = express.Router();
const Comment = require('../controllers/comments');

router.post('/', Comment.CreateComment);

router.get('/', Comment.GetAllComments);

module.exports = router;