const express = require('express');
const auth  = require('../middleware/auth');
const { signUp, signIn, userInfo, updateUser, logout } = require('../controllers/users');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User related operations
 */

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "samuel23505@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Samuel235!"
 *     responses:
 *       '200':
 *         description: New user registration successfully
 *       '400':
 *         description: Bad request, missing fields or invalid password
 *       '500':
 *         description: Internal server error
 */
router.post('/signup', signUp);

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "samuel23505@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Samuel235!"
 *     responses:
 *       '200':
 *         description: Sign in successfully
 *       '400':
 *         description: Email not found or password incorrect
 *       '500':
 *         description: Internal server error
 */
router.post('/signin', signIn);

/**
 * @openapi
 * /info:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user information (requires auth)
 *     responses:
 *       '200':
 *         description: User information retrieved
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/info", auth, userInfo);

/**
 * @openapi
 * /update:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user name (requires auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Samuel"
 *     responses:
 *       '200':
 *         description: User name updated successfully
 *       '400':
 *         description: Invalid name
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.put("/update", auth, updateUser);

/**
 * @openapi
 * /logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Log out the current user (requires auth)
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *       '401':
 *         description: Unauthorized - No token or invalid token provided
 *       '500':
 *         description: Internal server error
 */
router.post("/logout", auth, logout);

module.exports = router;

