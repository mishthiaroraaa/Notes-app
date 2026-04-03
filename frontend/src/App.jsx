import React, { useState, useEffect } from 'react';
import { Search, Plus, Book } from 'lucide-react';
import NoteItem from './components/NoteItem';
import NoteModal from './components/NoteModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Fetch Notes
  const fetchNotes = async (search = '') => {
    try {
      const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchNotes(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Create Note
  const handleCreateNote = async (note) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      fetchNotes(searchQuery);
    } catch (err) {
      console.error("Failed to create:", err);
    }
  };

  // Update Note
  const handleUpdateNote = async (id, updatedNote) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });
      fetchNotes(searchQuery);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      fetchNotes(searchQuery);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const modalSubmitHandler = (noteData) => {
    if (editingNote) {
      handleUpdateNote(editingNote.id, noteData);
    } else {
      handleCreateNote(noteData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-xl border border-amber-200">
              <Book className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">My Notes</h1>
              <p className="text-sm text-gray-500">Capture your ideas instantly.</p>
            </div>
          </div>

          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-lg font-medium transition shadow-md shadow-amber-500/20"
          >
            <Plus size={20} />
            <span>New Note</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search notes by title..." 
            className="w-full bg-white border border-gray-200 pl-12 pr-4 py-4 rounded-xl shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Book className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No notes found</h3>
            <p className="text-gray-500 mt-2">
              {searchQuery ? "Try a different search term" : "Click 'New Note' to create your first one!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteItem 
                key={note.id} 
                note={note} 
                onEdit={() => openEditModal(note)} 
                onDelete={() => handleDeleteNote(note.id)} 
              />
            ))}
          </div>
        )}

      </div>

      {isModalOpen && (
        <NoteModal 
          initialData={editingNote} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={modalSubmitHandler} 
        />
      )}
    </div>
  );
}

export default App;
