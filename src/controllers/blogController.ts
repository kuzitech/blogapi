import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BlogModel from '../models/blogModel';
import { statusCodes } from '../utils';
import validator from 'validator';

const POSTS_PER_PAGE = 10;

export default {
  /**
   * get all post articles
   *
   * @param req
   * @param res
   * @returns array paginated blog posts
   */
  getAllBlogs: async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      const blogs = await BlogModel.getAll(offset, POSTS_PER_PAGE);
      res.json({
        status: statusCodes.SUCCESSFUL,
        count: blogs.length,
        page,
        blogs,
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while fetching blogs',
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * get all post articles by a user
   *
   * @param req
   * @param res
   * @returns array paginated blog posts
   */
  getAllBlogsByUser: async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const userId = req.params.userId as string;

    if (!validator.isUUID(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid userId', status: statusCodes.INVALID });
    }

    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      const blogs = await BlogModel.getBlogsByUserId(
        userId,
        offset,
        POSTS_PER_PAGE
      );
      res.json({
        status: statusCodes.SUCCESSFUL,
        count: blogs.length,
        page,
        blogs,
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while fetching blogs',
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * get all post articles by a user
   *
   * @param req
   * @param res
   * @returns array paginated blog posts
   */
  searchBlogsByUser: async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const userId = req.params.userId as string;
    const searchTerm = req.query.q as string;

    if (!validator.isUUID(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid userId', status: statusCodes.INVALID });
    }

    if (searchTerm && !searchTerm.match(/^[a-z][a-z\s]*$/)) {
      return res.status(401).json({
        status: statusCodes.ERROR,
        error: 'Error in your search terms',
        searchTerm,
      });
    }

    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      const blogs = await BlogModel.searchBlogsByUserId(
        userId,
        searchTerm,
        offset,
        POSTS_PER_PAGE
      );
      res.json({
        status: statusCodes.SUCCESSFUL,
        count: blogs.length,
        page,
        blogs,
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while fetching blogs',
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * add a new blog post
   *
   * @param req
   * @param res
   * @returns Object
   */
  createBlog: async (req: Request, res: Response) => {
    const { title, content, userId, image } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        status: statusCodes.INVALID,
      });
    }
    if (!validator.isUUID(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid UserId', status: statusCodes.INVALID });
    }

    if (!validator.isLength(title, { min: 3, max: 255 })) {
      return res.status(400).json({
        error: 'Title must be between 3 and 255 characters',
        status: statusCodes.INVALID,
      });
    }

    if (!validator.isLength(content, { min: 10 })) {
      return res.status(400).json({
        error: 'Content must be at least 10 characters',
        status: statusCodes.INVALID,
      });
    }

    try {
      const newBlog = { title, content, userId, image };
      const blog = await BlogModel.create(newBlog);
      res.status(201).json({
        message: 'Blog created successfully',
        id: blog.id,
        status: statusCodes.SUCCESSFUL,
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while creating the blog' + error,
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * search through posts
   *
   * @param req
   * @param res
   * @returns Object
   */
  searchBlogs: async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;
    if (!searchTerm.match(/^[a-z][a-z\s]*$/)) {
      return res.status(401).json({
        status: statusCodes.ERROR,
        error: 'Error in your search terms',
        searchTerm,
      });
    }
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      const blogs = await BlogModel.search(searchTerm, offset, POSTS_PER_PAGE);
      res.json({ blogs, status: statusCodes.SUCCESSFUL });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while searching blogs',
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * edit blog posts by id
   *
   * @param req
   * @param res
   * @returns Object
   */
  editBlog: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!validator.isNumeric(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid postId', status: statusCodes.INVALID });
    }

    if (!validator.isLength(title, { min: 3, max: 255 })) {
      return res.status(400).json({
        error: 'Title must be between 3 and 255 characters',
        status: statusCodes.INVALID,
      });
    }

    if (!validator.isLength(content, { min: 10 })) {
      return res.status(400).json({
        error: 'Content must be at least 10 characters',
        status: statusCodes.INVALID,
      });
    }
    try {
      const updatedBlog = await BlogModel.edit(parseInt(id), title, content);
      if (updatedBlog) {
        res.json({ updatedBlog, status: statusCodes.SUCCESSFUL });
      } else {
        res.status(404).json({
          error: 'Blog post not found',
          status: statusCodes.NOT_FOUND,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while editing the blog post',
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * delete blog post by id
   *
   * @param req
   * @param res
   * @returns Object
   */
  deleteBlog: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validator.isNumeric(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid postId', status: statusCodes.INVALID });
    }

    try {
      const deletedBlog = await BlogModel.delete(parseInt(id));
      if (deletedBlog) {
        res.json({
          message: 'Blog post deleted successfully',
          status: statusCodes.SUCCESSFUL,
        });
      } else {
        res.status(404).json({
          error: 'Blog post not found',
          status: statusCodes.NOT_FOUND,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while deleting the blog post',
        status: statusCodes.ERROR,
      });
    }
  },
};
