import { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import BlogController from '../controllers/blogController';
import { verifyToken } from '../middleware/userAuth';
import * as timeout from 'connect-timeout';

const router = Router();

// User routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

// Blog routes
router.get('/blogs', BlogController.getAllBlogs);
router.get('/users', UserController.findUser);
router.get('/blogs/search', BlogController.searchBlogs);
router.put(
  '/blogs/:id',
  verifyToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  BlogController.editBlog
);
router.delete('/blogs/:id', verifyToken, BlogController.deleteBlog);
router.post(
  '/blogs',
  verifyToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  BlogController.createBlog
);
router.get('/', (req, res) => {
  res.send('hello world');
});

export default router;
