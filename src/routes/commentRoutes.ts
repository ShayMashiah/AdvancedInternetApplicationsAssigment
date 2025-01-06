import express from 'express';
const router = express.Router();
import Comment from '../controllers/comments';

router.post('/', Comment.Create);

router.get('/', Comment.GetAll);

router.get('/:id', Comment.GetById);

router.put('/:id', Comment.Update);

router.delete('/:id', Comment.Delete);

export default router;