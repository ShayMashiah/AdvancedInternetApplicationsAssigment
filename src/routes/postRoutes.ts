import express from 'express';
const router = express.Router();
import Post from '../controllers/post';

router.post('/', Post.CreateNewPost);

router.get('/', Post.GetAllPosts);

router.get('/:id', Post.PostByID);

router.put('/:id', Post.PostUpdate);

router.delete('/:id', Post.PostDelete);

export default router;
