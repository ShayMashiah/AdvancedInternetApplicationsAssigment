import express from 'express';
const router = express.Router();
import Comment from '../controllers/comments';

router.get('/', Comment.GetAll);

router.get('/:id', Comment.GetById);

router.post('/', Comment.Create);

router.put('/:id', Comment.Update);

router.delete('/:id', Comment.Delete);

export default router;
