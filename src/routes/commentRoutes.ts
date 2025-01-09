import express from 'express';
const router = express.Router();
import Comment from '../controllers/comments';
import {authMiddleware} from '../controllers/auth';

router.get('/', Comment.GetAll);

router.get('/:id', Comment.GetById);

router.post('/', authMiddleware, Comment.Create);

router.put('/:id', authMiddleware,  Comment.Update);

router.delete('/:id', authMiddleware, Comment.Delete);

export default router;
