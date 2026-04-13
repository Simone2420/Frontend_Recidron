import * as SQLite from 'expo-sqlite';
import { User } from '../types/user';
import { WasteReport } from '../types/report';

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

    // Create reports table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        material TEXT NOT NULL,
        zone TEXT NOT NULL,
        exactPoint TEXT NOT NULL,
        size TEXT NOT NULL,
        photoTaken INTEGER NOT NULL DEFAULT 0,
        userId TEXT NOT NULL,
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

    // Seed example reports if table is empty
    const reportCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM reports');
    if (reportCount && reportCount.count === 0) {
      console.log('--- Seeding Example Reports ---');
      const mockReports = [
        ['Aprovechable', 'Plástico PET y Cartón', 'Zona Norte', 'Parque Central', 'Mediano (2-5kg)', 1, 'admin@test.com', '2023-10-23 10:30:00'],
        ['Peligroso', 'Baterías y Químicos', 'Zona Industrial 4', 'Sótano', 'Leve', 1, 'admin@test.com', '2023-10-22 16:15:00'],
        ['Orgánico', 'Residuos de Alimentos', 'Barrio Miraflores', 'Cerca al comedor', 'Crítico', 0, 'admin@test.com', '2023-10-22 08:00:00'],
        ['No Aprovechable', 'Papel higiénico y servilletas', 'Centro Histórico', 'Baños principales', 'Leve', 1, 'admin@test.com', '2023-10-21 11:20:00'],
        ['Aprovechable', 'Cartón y Papel', 'Biblioteca General', 'Piso 2', 'Mediano (2-5kg)', 0, 'admin@test.com', '2023-10-20 09:00:00'],
        ['Orgánico', 'Residuos de cocina', 'Comedor Estudiantil', 'Puerta trasera', 'Leve', 1, 'admin@test.com', '2023-10-19 07:30:00'],
      ];

      for (const r of mockReports) {
        await db.runAsync(
          'INSERT INTO reports (category, material, zone, exactPoint, size, photoTaken, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          r
        );
      }
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

// --- REPORT FUNCTIONS ---

export const addReport = async (report: Omit<WasteReport, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await db.runAsync(
      'INSERT INTO reports (category, material, zone, exactPoint, size, photoTaken, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [report.category, report.material, report.zone, report.exactPoint, report.size, report.photoTaken, report.userId]
    );
    return true;
  } catch (error) {
    console.error('Error adding report:', error);
    return false;
  }
};

export const getReportsByUser = async (userId: string): Promise<WasteReport[]> => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    const reports = await db.getAllAsync<WasteReport>(
      'SELECT * FROM reports WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return reports;
  } catch (error) {
    console.error('Error getting user reports:', error);
    return [];
  }
};

export const getAllReports = async (): Promise<WasteReport[]> => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    const reports = await db.getAllAsync<WasteReport>('SELECT * FROM reports ORDER BY createdAt DESC');
    return reports;
  } catch (error) {
    console.error('Error getting all reports:', error);
    return [];
  }
};
