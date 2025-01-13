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

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *     400:
 *      description: Error getting posts
 */


router.get('/', Post.GetAll); 
/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: The post was retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */

router.get('/:id', Post.GetById); 

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */

router.post('/', authMiddleware, Post.Create);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

router.put('/:id', authMiddleware, Post.Update);


/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

router.delete('/:id', authMiddleware, Post.Delete);


export default router;