const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function initDB() {
    try {
        dbPromise = open({
            filename: path.join(__dirname, 'notes.db'),
            driver: sqlite3.Database
        });

        const db = await dbPromise;

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await db.exec(createTableQuery);
        console.log("SQLite Database 'notes.db' and 'notes' table ready.");
        return db;
    } catch (error) {
        console.error("Error initializing SQLite database:", error);
        throw error;
    }
}

async function getDB() {
    if (!dbPromise) {
        throw new Error("Database not initialized");
    }
    return dbPromise;
}

module.exports = { initDB, getDB };
