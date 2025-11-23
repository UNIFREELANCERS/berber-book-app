const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hairhustler.db');

// Create tables if they don't exist
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Barbers table
    db.run(`CREATE TABLE IF NOT EXISTS barbers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        skills TEXT,
        services TEXT,
        phone TEXT,
        status TEXT DEFAULT 'Offline',
        can_travel INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        barber_id INTEGER,
        service TEXT,
        date TEXT,
        time TEXT,
        location TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(barber_id) REFERENCES barbers(id)
    )`);
});

module.exports = db;
