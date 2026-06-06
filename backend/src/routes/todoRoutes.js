const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
} = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.route('/').get(getTodos).post(createTodo);
router.delete('/completed', clearCompletedTodos);
router.route('/:id').put(updateTodo).delete(deleteTodo);

module.exports = router;
