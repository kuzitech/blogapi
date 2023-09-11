import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Attempt to connect to the database
db.$connect()
  .then((obj) => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

export default db;
