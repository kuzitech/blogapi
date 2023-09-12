"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = tslib_1.__importDefault(require("../controllers/userController"));
const blogController_1 = tslib_1.__importDefault(require("../controllers/blogController"));
const userAuth_1 = require("../middleware/userAuth");
const multer_1 = tslib_1.__importDefault(require("multer"));
const fileController_1 = tslib_1.__importDefault(require("../controllers/fileController"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, 'public/assets');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// User routes
router.post('/register', userController_1.default.registerUser);
router.post('/login', userController_1.default.loginUser);
//  Upload
router.post('/upload', upload.single('image'), fileController_1.default.uploadImage);
//  Users
router.get('/users', userController_1.default.findUser);
router.get('/user/:userId/blogs', (0, express_validator_1.body)('userId').notEmpty().withMessage('UserId is required'), blogController_1.default.getAllBlogsByUser);
router.get('/user/:userId/blogs/search', (0, express_validator_1.body)('userId').notEmpty().withMessage('UserId is required'), blogController_1.default.searchBlogsByUser);
// Blog routes
router.get('/blogs', blogController_1.default.getAllBlogs);
router.get('/blogs/search', blogController_1.default.searchBlogs);
router.put('/blogs/:id', userAuth_1.verifyToken, (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'), (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'), blogController_1.default.editBlog);
router.delete('/blogs/:id', userAuth_1.verifyToken, blogController_1.default.deleteBlog);
router.post('/blogs', userAuth_1.verifyToken, upload.single('file'), (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'), (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'), blogController_1.default.createBlog);
router.get('/', (req, res) => {
    res.send('Welcome to the documentation for the Blog API. This API allows you to manage blog posts and user registration.');
});
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map