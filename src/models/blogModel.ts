import db from '../../db';

interface Blog {
  id?: number;
  title: string;
  content: string;
  image?: string;
  created_at?: Date;
  userId: string | undefined;
}

export default {
  /**
   * sql - get all post articles
   *
   * @param offset
   * @param limit
   * @returns array paginated blog posts
   */
  getAll: async (offset: number, limit: number) => {
    try {
      const blogs = await db.blog.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return blogs;
    } catch (error) {
      throw error;
    } finally {
      db.$disconnect();
    }
  },

  /**
   * sql - add a new blog post
   *
   * @param blog
   * @returns number post-id
   */
  create: async (blog: Blog) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id: blog.userId,
        },
      });

      if (!user) {
        throw new Error('User not found or not allowed to post');
      }

      const newBlog = await db.blog.create({
        data: {
          title: blog.title,
          content: blog.content,
          image: blog.image,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return newBlog;
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },

  /**
   * sql - search through posts
   *
   * @param searchTerm
   * @param offset
   * @param limit
   * @returns Array paginated blog post
   */
  search: async (searchTerm: string, offset: number, limit: number) => {
    try {
      console.log(searchTerm);
      return await db.blog.findMany({
        skip: offset,
        take: limit,
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },

  /**
   * sql - edit blog posts by id
   *
   * @param id
   * @param title
   * @param content
   * @returns Array edited post
   */
  edit: async (id: number, title: string, content: string) => {
    try {
      const updatedBlog = await db.blog.update({
        where: {
          id: id,
        },
        data: {
          title,
          content,
        },
      });

      return updatedBlog;
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },

  /**
   * sql - delete blog post by id
   *
   * @param id
   * @returns boolean
   */
  delete: async (id: number) => {
    try {
      const deleteBlog = await db.blog.delete({
        where: {
          id,
        },
      });

      return deleteBlog;
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },

  /**
   * get a user's posts
   * @param userId
   * @returns Array
   */
  getBlogsByUserId: async (userId: string, offset: number, limit: number) => {
    try {
      const blogs = await db.blog.findMany({
        where: {
          userId,
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return blogs;
    } catch (error) {
      throw new Error(`Error fetching blogs by user ID: ${error}`);
    } finally {
      await db.$disconnect();
    }
  },

  /**
   * get a user's posts
   * @param userId
   * @returns Array
   */
  searchBlogsByUserId: async (
    userId: string,
    searchTerm: string,
    offset: number,
    limit: number
  ) => {
    try {
      const blogs = await db.blog.findMany({
        where: {
          userId,
          AND: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return blogs;
    } catch (error) {
      throw new Error(`Error fetching blogs by user ID: ${error}`);
    } finally {
      await db.$disconnect();
    }
  },
};
