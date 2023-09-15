import { PrismaClient } from './prisma/generated/client';

const db = new PrismaClient();

// Attempt to connect to the database
db.$connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error: Error) => {
    console.error('Error connecting to the database:', error);
  });

export default db;
