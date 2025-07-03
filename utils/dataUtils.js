const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// User data operations
async function getUsers() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveUsers(users) {
  await ensureDataDirectory();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function getUserById(id) {
  const users = await getUsers();
  return users.find(user => user.id === id);
}

async function getUserByEmail(email) {
  const users = await getUsers();
  return users.find(user => user.email === email);
}

// Book data operations
async function getBooks() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(BOOKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveBooks(books) {
  await ensureDataDirectory();
  await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
}

async function getBookById(id) {
  const books = await getBooks();
  return books.find(book => book.id === id);
}

module.exports = {
  getUsers,
  saveUsers,
  getUserById,
  getUserByEmail,
  getBooks,
  saveBooks,
  getBookById
};