import express from 'express';
const router = express.Router();
import User from '../controllers/auth';

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 */

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Error getting users
 */

router.get('/', User.GetUsers);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user
 */

router.post('/register', User.Register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

router.post('/login', User.Login);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user by invalidating their refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to log out
 *                 example: 'your-refresh-token'
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: Invalid or missing refresh token
 *       404:
 *         description: Refresh token does not exist
 */


router.post('/logout', User.Logout);


/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token using the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to generate a new access token
 *                 example: 'your-refresh-token'
 *     responses:
 *       200:
 *         description: Successfully refreshed the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *                   example: 'new-access-token'
 *                 refreshToken:
 *                   type: string
 *                   description: The new refresh token
 *                   example: 'new-refresh-token'
 *       400:
 *         description: Invalid or missing refresh token
 *       404:
 *         description: User not found or invalid refresh token
 *       500:
 *         description: Server error during token refresh
 */


router.post('/refresh', User.Refresh);

export default router;
