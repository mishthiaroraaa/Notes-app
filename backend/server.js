const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const DB_FILE = path.join(__dirname, 'notes.json');

app.get('/', (req, res) => {
    res.send("Backend is Live and Running on Port 3001!");
});

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

app.get('/api/notes', (req, res) => {
    let notes = getNotes();
    notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    const notes = getNotes();
    const newNote = { id: Date.now(), title, content, created_at: new Date().toISOString() };
    notes.push(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const notes = getNotes().filter(n => n.id !== parseInt(id));
    saveNotes(notes);
    res.json({ message: 'Deleted' });
});

// HARDCODE 3001 to match user's manual Railway override
const PORT = 3001; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});
