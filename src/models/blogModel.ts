import db from '../../db';

interface Blog {
  id?: number;
  title: string;
  content: string;
  created_at?: Date;
}

export default {
  /**
   * sql - get all post articles
   *
   * @param offset
   * @param limit
   * @returns array paginated blog posts
   */
  getAll: (offset: number, limit: number) =>
    db.manyOrNone<Blog>(
      'SELECT * FROM blogs ORDER BY created_at DESC OFFSET $1 LIMIT $2',
      [offset, limit]
    ),

  /**
   * sql - add a new blog post
   *
   * @param blog
   * @returns number post-id
   */
  create: (blog: Blog) =>
    db.one('INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING id', [
      blog.title,
      blog.content,
    ]),

  /**
   * sql - search through posts
   *
   * @param searchTerm
   * @param offset
   * @param limit
   * @returns Array paginated blog post
   */
  search: (searchTerm: string, offset: number, limit: number) =>
    db.manyOrNone<Blog>(
      'SELECT * FROM blogs WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3',
      [`%${searchTerm}%`, offset, limit]
    ),

  /**
   * sql - edit blog posts by id
   *
   * @param id
   * @param title
   * @param content
   * @returns Array edited post
   */
  edit: (id: number, title: string, content: string) =>
    db.oneOrNone<Blog>(
      'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    ),

  /**
   * sql - delete blog post by id
   *
   * @param id
   * @returns boolean
   */
  delete: (id: number) =>
    db.result(
      'DELETE FROM blogs WHERE id = $1',
      id,
      (result) => result.rowCount > 0
    ),
};
