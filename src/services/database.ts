import * as SQLite from 'expo-sqlite';
import { User } from '../types/user';

const DATABASE_NAME = 'recidron.db';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Create users table
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        studentCode TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed admin user if it doesn't exist
    const adminUser = await db.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE email = ?', ['admin@test.com']);
    
    if (!adminUser) {
      console.log('--- Seeding Admin User ---');
      await db.runAsync(
        'INSERT INTO users (fullName, studentCode, email, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Administrator', '000000', 'admin@test.com', 'admin123', 'admin']
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const registerUser = async (user: Omit<User, 'id' | 'role' | 'createdAt'>): Promise<boolean> => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await db.runAsync(
      'INSERT INTO users (fullName, studentCode, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.fullName, user.studentCode, user.email, user.password || '', 'user']
    );
    return true;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    const user = await db.getFirstAsync<User>('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};
