"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../db"));
exports.default = {
    /**
     * sql - get all post articles
     *
     * @param offset
     * @param limit
     * @returns array paginated blog posts
     */
    getAll: (offset, limit) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield db_1.default.blog.findMany({
                skip: offset,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return blogs;
        }
        catch (error) {
            throw error;
        }
        finally {
            db_1.default.$disconnect();
        }
    }),
    /**
     * sql - add a new blog post
     *
     * @param blog
     * @returns number post-id
     */
    create: (blog) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield db_1.default.user.findUnique({
                where: {
                    id: blog.userId,
                },
            });
            if (!user) {
                throw new Error('User not found or not allowed to post');
            }
            const newBlog = yield db_1.default.blog.create({
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
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     * sql - search through posts
     *
     * @param searchTerm
     * @param offset
     * @param limit
     * @returns Array paginated blog post
     */
    search: (searchTerm, offset, limit) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(searchTerm);
            return yield db_1.default.blog.findMany({
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
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     * sql - edit blog posts by id
     *
     * @param id
     * @param title
     * @param content
     * @returns Array edited post
     */
    edit: (id, title, content) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedBlog = yield db_1.default.blog.update({
                where: {
                    id: id,
                },
                data: {
                    title,
                    content,
                },
            });
            return updatedBlog;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     * sql - delete blog post by id
     *
     * @param id
     * @returns boolean
     */
    delete: (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const deleteBlog = yield db_1.default.blog.delete({
                where: {
                    id,
                },
            });
            return deleteBlog;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     * get a user's posts
     * @param userId
     * @returns Array
     */
    getBlogsByUserId: (userId, offset, limit) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield db_1.default.blog.findMany({
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
        }
        catch (error) {
            throw new Error(`Error fetching blogs by user ID: ${error}`);
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     * get a user's posts
     * @param userId
     * @returns Array
     */
    searchBlogsByUserId: (userId, searchTerm, offset, limit) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield db_1.default.blog.findMany({
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
        }
        catch (error) {
            throw new Error(`Error fetching blogs by user ID: ${error}`);
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
};
//# sourceMappingURL=blogModel.js.map