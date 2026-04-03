const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'notes.json');
const PORT = process.env.PORT || 3001;

// Helper to handle CORS and JSON responses
const sendResponse = (res, status, data) => {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
};

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

const server = http.createServer((req, res) => {
    // Handle CORS Pre-flight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    const { url, method } = req;

    // Health Check
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        return res.end("Zero-Dependency Backend is LIVE!");
    }

    // CRUD Routes
    if (url.startsWith('/api/notes')) {
        const notes = getNotes();

        // GET: Fetch
        if (method === 'GET') {
            return sendResponse(res, 200, notes);
        }

        // POST: Create
        if (method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const { title, content } = JSON.parse(body);
                const newNote = { id: Date.now(), title, content, created_at: new Date().toISOString() };
                notes.push(newNote);
                saveNotes(notes);
                sendResponse(res, 201, newNote);
            });
            return;
        }

                if (method === 'PUT') {
                                const parts = pathname.split('/');
                                const id = parseInt(parts[parts.length - 1]);
                                let body = '';
                                req.on('data', chunk => { body += chunk.toString(); });
                                req.on('end', () => {
                                                    try {
                                                                            const { title, content } = JSON.parse(body);
                                                                            const index = notes.findIndex(n => n.id === id);
                                                                            if (index !== -1) {
                                                                                                        notes[index] = { ...notes[index], title, content };
                                                                                                        saveNotes(notes);
                                                                                                        sendResponse(res, 200, notes[index]);
                                                                                } else {
                                                                                                        sendResponse(res, 404, { error: 'Note not found' });
                                                                                }
                                                    } catch (e) { sendResponse(res, 400, { error: 'Invalid JSON' }); }
                                });
                                return;
                }

        
        // DELETE: Delete (e.g., /api/notes/123)
        if (method === 'DELETE') {
            const id = parseInt(url.split('/').pop());
            const filtered = notes.filter(n => n.id !== id);
            saveNotes(filtered);
            return sendResponse(res, 200, { message: 'Deleted' });
        }
    }

    // 404
    sendResponse(res, 404, { error: 'Route not found' });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
