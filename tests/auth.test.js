const request = require('supertest');
const app = require('../server');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return error for missing email', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return error for short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return error for invalid credentials', async () => {
      const userData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return error for missing email', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });
  });
});