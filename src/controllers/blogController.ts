import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BlogModel from '../models/blogModel';
import { statusCodes } from '../utils';

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
      res.json({ blogs, status: statusCodes.SUCCESSFUL });
    } catch (error) {
      res
        .status(500)
        .json({
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
    const { title, content } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), status: statusCodes.INVALID });
    }

    try {
      const newBlog = { title, content };
      const blog = await BlogModel.create(newBlog);
      res
        .status(201)
        .json({
          message: 'Blog created successfully',
          id: blog.id,
          status: statusCodes.SUCCESSFUL,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          error: 'An error occurred while creating the blog',
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
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    try {
      const offset = (page - 1) * POSTS_PER_PAGE;
      const blogs = await BlogModel.search(searchTerm, offset, POSTS_PER_PAGE);
      res.json({ blogs, status: statusCodes.SUCCESSFUL });
    } catch (error) {
      res
        .status(500)
        .json({
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
    try {
      const updatedBlog = await BlogModel.edit(parseInt(id), title, content);
      if (updatedBlog) {
        res.json({ updatedBlog, status: statusCodes.SUCCESSFUL });
      } else {
        res
          .status(404)
          .json({
            error: 'Blog post not found',
            status: statusCodes.NOT_FOUND,
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({
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
    try {
      const deletedBlog = await BlogModel.delete(parseInt(id));
      if (deletedBlog) {
        res.json({
          message: 'Blog post deleted successfully',
          status: statusCodes.SUCCESSFUL,
        });
      } else {
        res
          .status(404)
          .json({
            error: 'Blog post not found',
            status: statusCodes.NOT_FOUND,
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          error: 'An error occurred while deleting the blog post',
          status: statusCodes.ERROR,
        });
    }
  },
};
