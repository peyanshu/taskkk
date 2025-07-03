# Book Management API

A RESTful API for managing books with user authentication built with Node.js, Express, and JWT.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Book Management**: Full CRUD operations for books
- **User Ownership**: Users can only modify their own books
- **Search & Filtering**: Search books by genre
- **Pagination**: Paginated book listing
- **File-based Storage**: JSON files for data persistence
- **Comprehensive Testing**: Unit tests with Jest

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3000
```

**Important**: Change the `JWT_SECRET` to a strong, unique secret in production!

### Step 3: Start the Server

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on port 3000 by default. You should see:
```
Server is running on port 3000
Health check: http://localhost:3000/api/health
```

### Step 4: Verify Installation
Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "message": "Book Management API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Flow
1. Register a new user account
2. Login to receive a JWT token
3. Include the token in the Authorization header for all book operations

---

## Authentication Endpoints

### 1. Register User
**Endpoint**: `POST /api/auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Missing email/password or password too short
- `400`: User already exists with this email

#### Testing with curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Testing with Postman:
1. Method: POST
2. URL: `http://localhost:3000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

---

### 2. Login User
**Endpoint**: `POST /api/auth/login`

**Description**: Login with existing credentials

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Missing email or password
- `401`: Invalid email or password

#### Testing with curl:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Book Management Endpoints

**Authentication Required**: All book endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 3. Get All Books
**Endpoint**: `GET /api/books`

**Description**: Retrieve all books with optional pagination

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `genre` (optional): Filter by genre

**Success Response** (200):
```json
{
  "books": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Fiction",
      "publishedYear": 1925,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalBooks": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### Testing with curl:
```bash
# Get all books
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With pagination
curl -X GET "http://localhost:3000/api/books?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by genre
curl -X GET "http://localhost:3000/api/books?genre=fiction" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Search Books by Genre
**Endpoint**: `GET /api/books/search`

**Description**: Search books by genre

**Query Parameters**:
- `genre` (required): Genre to search for

**Success Response** (200):
```json
{
  "books": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Fiction",
      "publishedYear": 1925,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### Testing with curl:
```bash
curl -X GET "http://localhost:3000/api/books/search?genre=fiction" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Get Book by ID
**Endpoint**: `GET /api/books/:id`

**Description**: Retrieve a specific book by its ID

**Success Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "publishedYear": 1925,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `404`: Book not found

#### Testing with curl:
```bash
curl -X GET http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 6. Add New Book
**Endpoint**: `POST /api/books`

**Description**: Create a new book (user becomes the owner)

**Request Body**:
```json
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "Dystopian Fiction",
  "publishedYear": 1949
}
```

**Success Response** (201):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "1984",
  "author": "George Orwell",
  "genre": "Dystopian Fiction",
  "publishedYear": 1949,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

**Error Responses**:
- `400`: Missing required fields
- `400`: Invalid published year

#### Testing with curl:
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "genre": "Dystopian Fiction",
    "publishedYear": 1949
  }'
```

#### Testing with Postman:
1. Method: POST
2. URL: `http://localhost:3000/api/books`
3. Headers: 
   - `Authorization: Bearer YOUR_JWT_TOKEN`
   - `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "title": "1984",
     "author": "George Orwell",
     "genre": "Dystopian Fiction",
     "publishedYear": 1949
   }
   ```

---

### 7. Update Book
**Endpoint**: `PUT /api/books/:id`

**Description**: Update an existing book (only by the owner)

**Request Body**:
```json
{
  "title": "Nineteen Eighty-Four",
  "author": "George Orwell",
  "genre": "Dystopian Fiction",
  "publishedYear": 1949
}
```

**Success Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "Nineteen Eighty-Four",
  "author": "George Orwell",
  "genre": "Dystopian Fiction",
  "publishedYear": 1949,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:40:00.000Z"
}
```

**Error Responses**:
- `400`: Missing required fields or invalid data
- `403`: You can only update your own books
- `404`: Book not found

#### Testing with curl:
```bash
curl -X PUT http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nineteen Eighty-Four",
    "author": "George Orwell",
    "genre": "Dystopian Fiction",
    "publishedYear": 1949
  }'
```

---

### 8. Delete Book
**Endpoint**: `DELETE /api/books/:id`

**Description**: Delete a book (only by the owner)

**Success Response** (200):
```json
{
  "message": "Book deleted successfully"
}
```

**Error Responses**:
- `403`: You can only delete your own books
- `404`: Book not found

#### Testing with curl:
```bash
curl -X DELETE http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Complete Testing Workflow

### Step 1: Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Save the token from the response for subsequent requests.**

### Step 2: Add Some Books
```bash
# Add first book
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "publishedYear": 1925
  }'

# Add second book
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "publishedYear": 1960
  }'
```

### Step 3: Test All Endpoints
```bash
# Get all books
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search by genre
curl -X GET "http://localhost:3000/api/books/search?genre=fiction" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get specific book (replace with actual ID)
curl -X GET http://localhost:3000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update book (replace with actual ID)
curl -X PUT http://localhost:3000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Updated",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Fiction",
    "publishedYear": 1925
  }'

# Delete book (replace with actual ID)
curl -X DELETE http://localhost:3000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with Postman

### Setting up Postman Environment
1. Create a new environment in Postman
2. Add variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `token`: (will be set after login)

### Authentication Setup
1. Register/Login to get a token
2. Set the token in your environment variable
3. For subsequent requests, use `{{token}}` in the Authorization header

### Sample Postman Collection Structure
```
Book Management API/
├── Authentication/
│   ├── Register User
│   └── Login User
├── Books/
│   ├── Get All Books
│   ├── Search Books
│   ├── Get Book by ID
│   ├── Add New Book
│   ├── Update Book
│   └── Delete Book
└── Health Check
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Book Schema

```json
{
  "id": "auto-generated UUID",
  "title": "String (required)",
  "author": "String (required)", 
  "genre": "String (required)",
  "publishedYear": "Number (required)",
  "userId": "ID of user who added the book",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp (if updated)"
}
```

## User Schema

```json
{
  "id": "auto-generated UUID",
  "email": "String (unique, required)",
  "password": "String (hashed, required)",
  "createdAt": "ISO timestamp"
}
```

## Error Handling

The API provides consistent error responses with appropriate HTTP status codes:

```json
{
  "error": "Error message description"
}

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

```

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **User Ownership**: Users can only modify their own books
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses (no sensitive data exposure)
- **Environment Variables**: Sensitive data stored in .env file

## Features Implemented

JWT Authentication with register/login  
 Protected book routes  
 Full CRUD operations for books  
 User ownership validation  
 JSON file persistence  
 Request logging middleware  
 Comprehensive error handling  
 Search books by genre  
 Pagination support  
 UUID for book IDs  
 Unit tests with Jest  
 Complete API documentation  
 Setup and testing instructions  

## Troubleshooting

### Common Issues

1. **"JWT_SECRET is not defined"**
   - Ensure `.env` file exists with `JWT_SECRET` variable

2. **"ENOENT: no such file or directory"**
   - The app automatically creates data directories and files

3. **"Token verification failed"**
   - Check if the token is properly included in the Authorization header
   - Ensure the token hasn't expired (default: 7 days)

4. **"You can only update/delete your own books"**
   - Books can only be modified by the user who created them

### Getting Help

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify your `.env` file configuration
3. Ensure all dependencies are installed (`npm install`)
4. Test the health endpoint to verify the server is running

## License

This project is for educational purposes. Feel free to modify and extend as needed.
