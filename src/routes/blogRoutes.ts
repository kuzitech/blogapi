import { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import BlogController from '../controllers/blogController';
import FileController from '../controllers/fileController';
import { verifyToken } from '../middleware/userAuth';
import * as multer from 'multer';
import fileController from '../controllers/fileController';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'public/assets');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
    'Welcome to the documentation for the Blog API. This API allows you to manage blog posts and user registration.'
  );
});

export default router;
