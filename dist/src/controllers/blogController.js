"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_validator_1 = require("express-validator");
const blogModel_1 = tslib_1.__importDefault(require("../models/blogModel"));
const utils_1 = require("../utils");
const validator_1 = tslib_1.__importDefault(require("validator"));
const POSTS_PER_PAGE = 10;
exports.default = {
    /**
     * get all post articles
     *
     * @param req
     * @param res
     * @returns array paginated blog posts
     */
    getAllBlogs: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        try {
            const offset = (page - 1) * POSTS_PER_PAGE;
            const blogs = yield blogModel_1.default.getAll(offset, POSTS_PER_PAGE);
            res.json({
                status: utils_1.statusCodes.SUCCESSFUL,
                count: blogs.length,
                page,
                blogs,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while fetching blogs',
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * get all post articles by a user
     *
     * @param req
     * @param res
     * @returns array paginated blog posts
     */
    getAllBlogsByUser: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const userId = req.params.userId;
        if (!validator_1.default.isUUID(userId)) {
            return res
                .status(400)
                .json({ error: 'Invalid userId', status: utils_1.statusCodes.INVALID });
        }
        try {
            const offset = (page - 1) * POSTS_PER_PAGE;
            const blogs = yield blogModel_1.default.getBlogsByUserId(userId, offset, POSTS_PER_PAGE);
            res.json({
                status: utils_1.statusCodes.SUCCESSFUL,
                count: blogs.length,
                page,
                blogs,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while fetching blogs',
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * get all post articles by a user
     *
     * @param req
     * @param res
     * @returns array paginated blog posts
     */
    searchBlogsByUser: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const userId = req.params.userId;
        const searchTerm = req.query.q;
        if (!validator_1.default.isUUID(userId)) {
            return res
                .status(400)
                .json({ error: 'Invalid userId', status: utils_1.statusCodes.INVALID });
        }
        if (searchTerm && !searchTerm.match(/^[a-z][a-z\s]*$/)) {
            return res.status(401).json({
                status: utils_1.statusCodes.ERROR,
                error: 'Error in your search terms',
                searchTerm,
            });
        }
        try {
            const offset = (page - 1) * POSTS_PER_PAGE;
            const blogs = yield blogModel_1.default.searchBlogsByUserId(userId, searchTerm, offset, POSTS_PER_PAGE);
            res.json({
                status: utils_1.statusCodes.SUCCESSFUL,
                count: blogs.length,
                page,
                blogs,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while fetching blogs',
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * add a new blog post
     *
     * @param req
     * @param res
     * @returns Object
     */
    createBlog: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { title, content, userId, image } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                status: utils_1.statusCodes.INVALID,
            });
        }
        if (!validator_1.default.isUUID(userId)) {
            return res
                .status(400)
                .json({ error: 'Invalid UserId', status: utils_1.statusCodes.INVALID });
        }
        if (!validator_1.default.isLength(title, { min: 3, max: 255 })) {
            return res.status(400).json({
                error: 'Title must be between 3 and 255 characters',
                status: utils_1.statusCodes.INVALID,
            });
        }
        if (!validator_1.default.isLength(content, { min: 10 })) {
            return res.status(400).json({
                error: 'Content must be at least 10 characters',
                status: utils_1.statusCodes.INVALID,
            });
        }
        try {
            const newBlog = { title, content, userId, image };
            const blog = yield blogModel_1.default.create(newBlog);
            res.status(201).json({
                message: 'Blog created successfully',
                id: blog.id,
                status: utils_1.statusCodes.SUCCESSFUL,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while creating the blog' + error,
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * search through posts
     *
     * @param req
     * @param res
     * @returns Object
     */
    searchBlogs: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const searchTerm = req.query.q;
        if (!searchTerm.match(/^[a-z][a-z\s]*$/)) {
            return res.status(401).json({
                status: utils_1.statusCodes.ERROR,
                error: 'Error in your search terms',
                searchTerm,
            });
        }
        const page = req.query.page ? parseInt(req.query.page) : 1;
        try {
            const offset = (page - 1) * POSTS_PER_PAGE;
            const blogs = yield blogModel_1.default.search(searchTerm, offset, POSTS_PER_PAGE);
            res.json({ blogs, status: utils_1.statusCodes.SUCCESSFUL });
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while searching blogs',
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * edit blog posts by id
     *
     * @param req
     * @param res
     * @returns Object
     */
    editBlog: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!validator_1.default.isNumeric(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid postId', status: utils_1.statusCodes.INVALID });
        }
        if (!validator_1.default.isLength(title, { min: 3, max: 255 })) {
            return res.status(400).json({
                error: 'Title must be between 3 and 255 characters',
                status: utils_1.statusCodes.INVALID,
            });
        }
        if (!validator_1.default.isLength(content, { min: 10 })) {
            return res.status(400).json({
                error: 'Content must be at least 10 characters',
                status: utils_1.statusCodes.INVALID,
            });
        }
        try {
            const updatedBlog = yield blogModel_1.default.edit(parseInt(id), title, content);
            if (updatedBlog) {
                res.json({ updatedBlog, status: utils_1.statusCodes.SUCCESSFUL });
            }
            else {
                res.status(404).json({
                    error: 'Blog post not found',
                    status: utils_1.statusCodes.NOT_FOUND,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while editing the blog post',
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * delete blog post by id
     *
     * @param req
     * @param res
     * @returns Object
     */
    deleteBlog: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        if (!validator_1.default.isNumeric(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid postId', status: utils_1.statusCodes.INVALID });
        }
        try {
            const deletedBlog = yield blogModel_1.default.delete(parseInt(id));
            if (deletedBlog) {
                res.json({
                    message: 'Blog post deleted successfully',
                    status: utils_1.statusCodes.SUCCESSFUL,
                });
            }
            else {
                res.status(404).json({
                    error: 'Blog post not found',
                    status: utils_1.statusCodes.NOT_FOUND,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while deleting the blog post',
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
};
//# sourceMappingURL=blogController.js.map