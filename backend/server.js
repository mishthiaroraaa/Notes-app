const express = require('express');
const cors = require('cors');
const { initDB, getDB } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

initDB().then(() => {
    
    // 1. GET: Fetch all notes (with optional search by title)
    app.get('/api/notes', async (req, res) => {
        try {
            const { search } = req.query;
            const db = await getDB();
            
            let query = 'SELECT * FROM notes ORDER BY created_at DESC';
            let params = [];

            if (search) {
                query = 'SELECT * FROM notes WHERE title LIKE ? ORDER BY created_at DESC';
                params = [`%${search}%`];
            }

            const rows = await db.all(query, params);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({ error: 'Failed to fetch notes' });
        }
    });

    // 2. POST: Create a new note
    app.post('/api/notes', async (req, res) => {
        try {
            const { title, content } = req.body;
            if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

            const db = await getDB();
            const result = await db.run(
                'INSERT INTO notes (title, content) VALUES (?, ?)',
                [title, content]
            );
            
            res.status(201).json({ id: result.lastID, title, content });
        } catch (error) {
            console.error('Error creating note:', error);
            res.status(500).json({ error: 'Failed to create note' });
        }
    });

    // 3. PUT: Update an existing note
    app.put('/api/notes/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            
            if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

            const db = await getDB();
            await db.run(
                'UPDATE notes SET title = ?, content = ? WHERE id = ?',
                [title, content, id]
            );
            
            res.json({ message: 'Note updated successfully' });
        } catch (error) {
            console.error('Error updating note:', error);
            res.status(500).json({ error: 'Failed to update note' });
        }
    });

    // 4. DELETE: Delete a note
    app.delete('/api/notes/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const db = await getDB();

            await db.run('DELETE FROM notes WHERE id = ?', [id]);
            res.json({ message: 'Note deleted successfully' });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).json({ error: 'Failed to delete note' });
        }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Backend Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error("Failed to start server due to database issue.", err);
});
