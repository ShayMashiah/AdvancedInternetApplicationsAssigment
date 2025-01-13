import express from 'express';
const router = express.Router();
import Comment from '../controllers/comments';
import {authMiddleware} from '../controllers/auth';

/**
* @swagger
* tags:
*   name: Comment
*   description: The Comments API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - PostId
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *         author:
 *           type: string
 *           description: The author of the comment
 *         PostId:
 *           type: string
 *           description: The ID of the post the comment is associated with
 *       example:
 *         PostId: "60c72b2f9b1d8b3f12c4b5cd"
 *         content: "This is a comment."
 *         author: "User123"
 *         
 */

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get all comments
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: A list of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Error getting comments
 */

router.get('/', Comment.GetAll);


/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get a comment by its ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to be fetched
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Error getting comment
 *       404:
 *         description: Comment Not found
 */

router.get('/:id', Comment.GetById);


/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request 
 *       401:
 *         description: Unauthorized 
 */

router.post('/', authMiddleware, Comment.Create);

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Update an existing comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request 
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Comment Not found 
 */

router.put('/:id', authMiddleware,  Comment.Update);


/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete an existing comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the comment
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment Not found 
 */

router.delete('/:id', authMiddleware, Comment.Delete);

export default router;