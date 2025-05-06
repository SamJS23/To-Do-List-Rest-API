const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createTodo,getAllTodos,updateTodo,deleteTodo} = require('../controllers/todolist');

/**
 * @openapi
 * tags:
 *   - name: Todo
 *     description: Authenticated Todo operations
 */

/**
 * @openapi
 * /createtodo:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Create a new todo (requires auth)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Buy groceries"
 *     responses:
 *       201:
 *         description: Todo created
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 */
router.post('/createtodo', auth, createTodo); 
/**
 * @openapi
 * /gettodos:
 *   get:
 *     tags:
 *       - Todo
 *     summary: Get all todos for the logged-in user (requires auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 *       500:
 *         description: Server error
 */
router.get('/gettodos', auth, getAllTodos);  
/**
 * @openapi
 * /updatetodo/{id}:
 *   put:
 *     tags:
 *       - Todo
 *     summary: Update a todo (requires auth)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Finished WADS Assignment"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo updated
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.put('/updatetodo/:id', auth, updateTodo);  
/**
 * @openapi
 * /deletetodo/{id}:
 *   delete:
 *     tags:
 *       - Todo
 *     summary: Delete a todo (requires auth)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete('/deletetodo/:id', auth, deleteTodo); 

 
module.exports = router;
