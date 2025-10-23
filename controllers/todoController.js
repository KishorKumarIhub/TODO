const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           description: The description of the todo
 *         completed:
 *           type: boolean
 *           description: The completion status of the todo
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: The priority level of the todo
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date of the todo
 *         user:
 *           type: string
 *           description: The ID of the user who owns the todo
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the todo was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the todo was last updated
 *     TodoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             todo:
 *               $ref: '#/components/schemas/Todo'
 *     TodoListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             todos:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *             total:
 *               type: integer
 *               description: Total number of todos
 *             page:
 *               type: integer
 *               description: Current page number
 *             limit:
 *               type: integer
 *               description: Number of todos per page
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of todos per page
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority level
 *     responses:
 *       200:
 *         description: List of todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoListResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getAllTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { user: req.user._id };
    
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }
    
    
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: {
        todos,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoResponse'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo retrieved successfully',
      data: { todo }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Todo title
 *               description:
 *                 type: string
 *                 description: Todo description
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Todo priority level
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Todo due date
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, priority, dueDate } = req.body;

    const todo = new Todo({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.user._id
    });

    await todo.save();

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: { todo }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               title:
 *                 type: string
 *                 description: Todo title
 *               description:
 *                 type: string
 *                 description: Todo description
 *               completed:
 *                 type: boolean
 *                 description: Todo completion status
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Todo priority level
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Todo due date
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoResponse'
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Update fields
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;

    await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: { todo }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo',
      error: error.message
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
