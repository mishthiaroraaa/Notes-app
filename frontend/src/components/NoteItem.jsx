import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

function NoteItem({ note, onEdit, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-gray-600 line-clamp-4 whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Note"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
