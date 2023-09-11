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
  findByUsername: async (username: string) => {
    try {
      const user = await db.user.findFirst({
        where: {
          username: username,
        },
      });

      return user;
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },

  /**
   * Find user by email
   *
   * @param username string
   * @param email string
   * @returns
   */
  findByEmailOrUsername: async (username: string, email: string) => {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      return user;
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },

  /**
   *
   * @param email string
   * @returns
   */
  findByEmail: async (email: string) => {
    try {
      const user = await db.user.findFirst({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  },
};
