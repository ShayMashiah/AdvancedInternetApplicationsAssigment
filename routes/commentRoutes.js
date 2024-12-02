const express = require('express');
const router = express.Router();
const Comment = require('../controllers/comments');

router.post('/', Comment.CreateComment);

module.exports = router;