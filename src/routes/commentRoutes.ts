import express from 'express';
const router = express.Router();
import Comment from '../controllers/comments';

router.post('/', Comment.CreateComment);

router.get('/', Comment.GetAllComments);

router.get('/:id', Comment.CommentByPostID);

router.put('/:id', Comment.CommentUpdate);

router.delete('/:id', Comment.CommentDelete);

export default router;