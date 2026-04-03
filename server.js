const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// Explicitly allow everything for CORS to stop browser blocks
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

const DB_FILE = path.join(__dirname, 'notes.json');

// Health check to verify Railway is UP
app.get('/', (req, res) => {
    res.send("Backend is Live and Running!");
});

// Helper for JSON DB
const getNotes = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return [];
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
};

const saveNotes = (notes) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2));
};

// Routes
app.get('/api/notes', (req, res) => {
    const { search } = req.query;
    let notes = getNotes();
    notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (search) {
        const q = search.toLowerCase();
        notes = notes.filter(n => n.title.toLowerCase().includes(q));
    }
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const notes = getNotes();
    const newNote = { id: Date.now(), title, content, created_at: new Date().toISOString() };
    notes.push(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    let notes = getNotes();
    const idx = notes.findIndex(n => n.id === parseInt(id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    notes[idx] = { ...notes[idx], title, content };
    saveNotes(notes);
    res.json({ message: 'Updated' });
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const notes = getNotes().filter(n => n.id !== parseInt(id));
    saveNotes(notes);
    res.json({ message: 'Deleted' });
});

// HARDCODE PORT to 3001 to match user's Railway setting
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});
