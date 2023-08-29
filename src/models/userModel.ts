import db from '../../db';

interface User {
  id?: string;
  username: string;
  password: string;
  email: string;
}

export default {
  /**
   * Find user by username
   *
   * @param username
   * @returns string username
   */
  findByUsername: (username: string) =>
    db.oneOrNone<User>('SELECT * FROM users WHERE username = $1', username),

  /**
   * Find user by email
   *
   * @param username string
   * @param email string
   * @returns
   */
  findByEmailOrUsername: (username: string, email: string) =>
    db.oneOrNone('SELECT * FROM users WHERE username = $1 OR email = $2', [
      username,
      email,
    ]),

  /**
   *
   * @param email string
   * @returns
   */
  findByEmail: (email: string) =>
    db.oneOrNone('SELECT * FROM users WHERE email = $1', email),
};
