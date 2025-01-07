import express from 'express';
const router = express.Router();
import Post from '../controllers/post';

router.post('/', Post.GetAll);

router.get('/', Post.GetById);

router.get('/:id', Post.Create);

router.put('/:id', Post.Update);

router.delete('/:id', Post.Delete);

export default router;
