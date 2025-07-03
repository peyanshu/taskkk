const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/middleware');
const { getBooks, saveBooks, getBookById } = require('../utils/dataUtils');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /books - List all books with optional search and pagination
router.get('/', async (req, res) => {
  try {
    const { genre, page = 1, limit = 10 } = req.query;
    let books = await getBooks();

    // Filter by genre if provided
    if (genre) {
      books = books.filter(book => 
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBooks = books.slice(startIndex, endIndex);

    res.json({
      books: paginatedBooks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(books.length / limit),
        totalBooks: books.length,
        hasNextPage: endIndex < books.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /books/search - Search books by genre
router.get('/search', async (req, res) => {
  try {
    const { genre } = req.query;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre parameter is required' });
    }

    const books = await getBooks();
    const filteredBooks = books.filter(book => 
      book.genre.toLowerCase().includes(genre.toLowerCase())
    );

    res.json({
      books: filteredBooks,
      count: filteredBooks.length
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// GET /books/:id - Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /books - Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;

    // Validation
    if (!title || !author || !genre || !publishedYear) {
      return res.status(400).json({ 
        error: 'All fields are required: title, author, genre, publishedYear' 
      });
    }

    if (typeof publishedYear !== 'number' || publishedYear < 0) {
      return res.status(400).json({ error: 'Published year must be a valid number' });
    }

    // Create new book
    const newBook = {
      id: uuidv4(),
      title,
      author,
      genre,
      publishedYear,
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };

    // Save book
    const books = await getBooks();
    books.push(newBook);
    await saveBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT /books/:id - Update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    const books = await getBooks();
    const bookIndex = books.findIndex(book => book.id === req.params.id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = books[bookIndex];

    // Check if user owns the book
    if (book.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own books' });
    }

    // Validation
    if (!title || !author || !genre || !publishedYear) {
      return res.status(400).json({ 
        error: 'All fields are required: title, author, genre, publishedYear' 
      });
    }

    if (typeof publishedYear !== 'number' || publishedYear < 0) {
      return res.status(400).json({ error: 'Published year must be a valid number' });
    }

    // Update book
    books[bookIndex] = {
      ...book,
      title,
      author,
      genre,
      publishedYear,
      updatedAt: new Date().toISOString()
    };

    await saveBooks(books);
    res.json(books[bookIndex]);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /books/:id - Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const books = await getBooks();
    const bookIndex = books.findIndex(book => book.id === req.params.id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = books[bookIndex];

    // Check if user owns the book
    if (book.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own books' });
    }

    // Remove book
    books.splice(bookIndex, 1);
    await saveBooks(books);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;