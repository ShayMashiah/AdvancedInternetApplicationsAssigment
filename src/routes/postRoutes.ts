import express from 'express';
const router = express.Router();
import Post from '../controllers/post';
import {authMiddleware} from '../controllers/auth';

router.get('/', Post.GetAll); 

router.get('/:id', Post.GetById); 

router.post('/', Post.Create); 

router.put('/:id', Post.Update); 

router.delete('/:id', Post.Delete); 

export default router;
