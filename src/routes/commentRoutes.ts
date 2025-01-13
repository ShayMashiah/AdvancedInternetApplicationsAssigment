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

router.get('/', Comment.GetAll);

router.get('/:id', Comment.GetById);

router.post('/', authMiddleware, Comment.Create);

router.put('/:id', authMiddleware,  Comment.Update);

router.delete('/:id', authMiddleware, Comment.Delete);

export default router;
