# Blog API Documentation

Welcome to the documentation for the Blog API. This API allows you to manage blog posts and user registration.

## Getting Started

To get started with the Blog API, follow these steps:

1. Clone the repository: `git clone https://github.com/kuzitech/blogapi.git`
2. Navigate to the project directory: `cd blogapi`
3. Install dependencies: `npm install`
4. Set up the PostgreSQL database according to the provided schema.

## Prerequisites
- Node.js and npm installed
- PostgreSQL database setup

## Setting Up PostgreSQL
1. Install PostgreSQL on your machine or use a hosted service.
2. Create a new database for the blog API or load the schema file by following the instructions below .
3. Update the database connection configuration in the `db.ts` file if needed or just update the `.env` created earlier.

## Loading the Database Schema
1. In the project root directory, locate the `dbSchema.sql` file.
2. Open a terminal and navigate to the project directory.
3. Run the following command to load the schema into your PostgreSQL database:

   ```sh
   psql -h <hostname> -p <port> -U <username> -d <database_name> -a -f dbSchema.sql

## Configuration
1. Create a `.env` file in the project root folder and add your database connection details, JWT_SECRET, PORT. A sample `.env copy` is in the folder.
2. Add the following environment variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   SQL_PWD=""
   SQL_HOST="localhost"
   SQL_PORT=5432
   SQL_USER=""
   SQL_DB="blogApp"
   ```

## Available Endpoints

The API provides the following endpoints:

| Method | Endpoint                 | Description               |
|--------|--------------------------|---------------------------|
| GET    | /api/posts               | Get all blog posts        |
| GET    | /api/posts/:id           | Get a specific blog post  |
| POST   | /api/posts               | Create a new blog post    |
| PUT    | /api/posts/:id           | Update a blog post        |
| DELETE | /api/posts/:id           | Delete a blog post        |
| POST   | /api/register            | Register a new user       |
| POST   | /api/login               | Log in a user             |

## Status Codes

Here are some of the commonly used HTTP status codes returned by the API:

| Status Code | Description                |
|-------------|----------------------------|
| 200         | OK                         |
| 201         | Created                    |
| 400         | Bad Request                |
| 401         | Unauthorized               |
| 403         | Forbidden                  |
| 404         | Not Found                  |
| 500         | Internal Server Error      |

## Response Codes

Here are response codes returned by the API:

| Status Code | Description                |
|-------------|----------------------------|
| 10001       | NOT_FOUND                  |
| 10010       | SUCCESSFUL                 |
| 10040       | INVALID                    |
| 10090       | ERROR                      |
| 10030       | ACCESS_DENIED              |

## Authentication

To access protected routes, you need to include a valid JWT token in the Authorization header.
Call the /api/login to retrieve a valid JWT token.

## Error Handling

When errors occur, the API responds with an error message and the appropriate status code.

## Examples

For detailed usage examples and API endpoints, refer to the [API documentation](/api-documentation.md).

## Available Endpoints

### Get All Blog Posts

**Endpoint:** `GET /api/posts`

**Parameters:** None

### Get a Specific Blog Post

**Endpoint:** `GET /api/posts/:id`

**Parameters:**
- `:id` (URL parameter) - The ID of the blog post.

### Create a New Blog Post

**Endpoint:** `POST /api/posts`

**Parameters:**
- Request Body: Blog post data (title, content).

### Update a Blog Post

**Endpoint:** `PUT /api/posts/:id`

**Parameters:**
- `:id` (URL parameter) - The ID of the blog post.
- Request Body: Updated blog post data (title, content).

### Delete a Blog Post

**Endpoint:** `DELETE /api/posts/:id`

**Parameters:**
- `:id` (URL parameter) - The ID of the blog post.

### User Registration

**Endpoint:** `POST /api/register`

**Parameters:**
- Request Body: User registration data (username, email, password).

### User Login

**Endpoint:** `POST /api/login`

**Parameters:**
- Request Body: User login data (username or email, password).


## Contributing

Contributions to the API are welcome! Please submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
