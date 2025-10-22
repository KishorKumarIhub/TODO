const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Validation middleware
const createTodoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('description')
    .optional(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
];

const updateTodoValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid todo ID'),
  body('title')
    .optional(),
  body('description')
    .optional(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
];

const todoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid todo ID')
];

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// GET /api/todos
router.get('/', getAllTodos);

// GET /api/todos/:id
router.get('/:id', todoIdValidation, getTodoById);

// POST /api/todos
router.post('/', createTodoValidation, createTodo);

// PUT /api/todos/:id
router.put('/:id', updateTodoValidation, updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', todoIdValidation, deleteTodo);

module.exports = router;
