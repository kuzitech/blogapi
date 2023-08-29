import * as pgPromise from 'pg-promise';
import * as dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();
const conn = `postgres://${process.env.SQL_USER}:${process.env.SQL_PWD}@${process.env.SQL_HOST}:${process.env.SQL_PORT}/${process.env.SQL_DB}`;
const db = pgp(conn);

// Attempt to connect to the database
db.connect()
  .then((obj) => {
    console.log('Connected to the database');
    obj.done(); // Releases the connection back to the pool
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

export default db;
