-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS blogApp;

-- Switch to the newly created database
\c blogApp;

-- Create the 'blogs' tableCREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Create the User table
CREATE TABLE IF NOT EXISTS "users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data into the Blog table (optional)
INSERT INTO blog (title, content) VALUES
  ('First Post', 'This is the content of the first post.'),
  ('Second Post', 'This is the content of the second post.');
