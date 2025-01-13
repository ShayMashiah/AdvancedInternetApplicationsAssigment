import express from 'express';
const router = express.Router();
import Post from '../controllers/post';
import {authMiddleware} from '../controllers/auth';

/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: The post title
 *         content:
 *           type: string
 *           description: The post content
 *         author:
 *           type: string
 *           description: The post author
 *       example:
 *         title: 'Post Title'
 *         content: 'Post Content'
 *         author: 'Post Author'
 */

router.get('/', Post.GetAll); 

router.get('/:id', Post.GetById); 

router.post('/', authMiddleware ,Post.Create); 

router.put('/:id', authMiddleware ,Post.Update); 

router.delete('/:id', authMiddleware ,Post.Delete); 

export default router;
