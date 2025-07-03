const request = require('supertest');
const app = require('../server');

describe('Books Endpoints', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register and login a test user
    const userData = {
      email: 'booktest@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  describe('GET /api/books', () => {
    it('should return empty array when no books exist', async () => {
      const response = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.books).toEqual([]);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/books');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book successfully', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publishedYear: 2023
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(bookData.title);
      expect(response.body.userId).toBe(userId);
      expect(response.body).toHaveProperty('id');
    });

    it('should return error for missing required fields', async () => {
      const bookData = {
        title: 'Test Book'
        // Missing author, genre, publishedYear
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required: title, author, genre, publishedYear');
    });

    it('should return error for invalid published year', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publishedYear: 'invalid'
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Published year must be a valid number');
    });
  });
});