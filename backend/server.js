const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'notes.json');

// Initialize JSON database
function getNotes() {
    if (!fs.existsSync(DB_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return data ? JSON.parse(data) : [];
}

function saveNotes(notes) {
    fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2));
}

// 1. GET: Fetch all notes
app.get('/api/notes', (req, res) => {
    try {
        const { search } = req.query;
        let notes = getNotes();
        
        notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (search) {
            const query = search.toLowerCase();
            notes = notes.filter(n => n.title.toLowerCase().includes(query));
        }
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// 2. POST: Create a new note
app.post('/api/notes', (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        const notes = getNotes();
        const newNote = {
            id: Date.now(),
            title,
            content,
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        notes.push(newNote);
        saveNotes(notes);
        
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// 3. PUT: Update an existing note
app.put('/api/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        const notes = getNotes();
        const index = notes.findIndex(n => n.id === parseInt(id));
        if (index === -1) return res.status(404).json({ error: 'Note not found' });
        
        notes[index].title = title;
        notes[index].content = content;
        saveNotes(notes);
        
        res.json({ message: 'Note updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// 4. DELETE: Delete a note
app.delete('/api/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const notes = getNotes();
        const filtered = notes.filter(n => n.id !== parseInt(id));
        saveNotes(filtered);
        
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Server is running on port ${PORT}`);
});
