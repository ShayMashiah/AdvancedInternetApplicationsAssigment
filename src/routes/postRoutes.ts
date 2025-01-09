import express from 'express';
const router = express.Router();
import Post from '../controllers/post';
import {authMiddleware} from '../controllers/auth';

router.get('/', Post.GetAll); 

router.get('/:id', Post.GetById); 

router.post('/', authMiddleware ,Post.Create); 

router.put('/:id', authMiddleware ,Post.Update); 

router.delete('/:id', authMiddleware ,Post.Delete); 

export default router;
