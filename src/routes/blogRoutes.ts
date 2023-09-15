import { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import BlogController from '../controllers/blogController';
import { verifyToken } from '../middleware/userAuth';
import multer from 'multer';
import fileController from '../controllers/fileController';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// User routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

//  Upload
router.post('/upload', upload.single('image'), fileController.uploadImage);

//  Users
router.get('/users', UserController.findUser);
router.get(
  '/user/:userId/blogs',
  body('userId').notEmpty().withMessage('UserId is required'),
  BlogController.getAllBlogsByUser
);
router.get(
  '/user/:userId/blogs/search',
  body('userId').notEmpty().withMessage('UserId is required'),
  BlogController.searchBlogsByUser
);
// Blog routes
router.get('/blogs', BlogController.getAllBlogs);
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
  upload.single('file'),
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  BlogController.createBlog
);
router.get('/', (req, res) => {
  res.send(
    `<h1>Welcome to the documentation for the Blog API.</h1><p> This API allows you to manage blog posts and user registration.</p> <p>Follow the documentation <a href="https://documenter.getpostman.com/view/10704114/2s9Y5ZwNRW">here</a> to preview the endpoints and its samples on postman. Enjoy 🚀</p>`
  );
});

export default router;
