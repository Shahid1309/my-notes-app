'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Edit3, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const categories = [
  { name: 'Personal', color: 'bg-blue-500' },
  { name: 'Work', color: 'bg-green-500' },
  { name: 'Ideas', color: 'bg-purple-500' },
  { name: 'Tasks', color: 'bg-orange-500' },
  { name: 'Study', color: 'bg-pink-500' },
];

const NoteCard = ({ 
  note, 
  onEdit, 
  onDelete 
}: { 
  note: Note; 
  onEdit: (note: Note) => void; 
  onDelete: (id: string) => void; 
}) => {
  const categoryColor = categories.find(cat => cat.name === note.category)?.color || 'bg-gray-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <Card className="h-full backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {note.title || 'Untitled Note'}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className={cn("text-white border-0", categoryColor)}>
                  <Tag className="w-3 h-3 mr-1" />
                  {note.category}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="h-8 w-8 p-0 hover:bg-indigo-100 hover:text-indigo-600"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0" onClick={() => onEdit(note)}>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {note.content || 'No content...'}
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {format(note.updatedAt, 'MMM d, yyyy')}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NoteEditor = ({ 
  note, 
  onSave, 
  onClose 
}: { 
  note: Note | null; 
  onSave: (note: Partial<Note>) => void; 
  onClose: () => void; 
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'Personal');

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim(),
        category,
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={category === cat.name ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "text-sm transition-all duration-200",
                    category === cat.name 
                      ? `${cat.color} text-white hover:opacity-90` 
                      : "hover:bg-gray-100"
                  )}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 px-0 focus-visible:ring-0 placeholder:text-gray-400 mb-4"
          />
          
          <textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-0 border-0 resize-none outline-none text-gray-700 placeholder:text-gray-400"
            autoFocus
          />
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
              disabled={!title.trim() && !content.trim()}
            >
              Save Note
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Initialize with some sample notes
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Welcome to Your Notes App',
        content: 'This is a modern, beautiful notes application built with Next.js and Framer Motion. You can create, edit, and organize your thoughts with smooth animations and a clean interface.',
        category: 'Personal',
        createdAt: new Date(),
        updatedAt: new Date(),
        color: 'bg-blue-500'
      },
      {
        id: '2',
        title: 'Project Ideas',
        content: 'List of exciting project ideas:\n- Modern dashboard with real-time data\n- AI-powered chat application\n- Collaborative whiteboard tool',
        category: 'Ideas',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        color: 'bg-purple-500'
      },
      {
        id: '3',
        title: 'Meeting Notes - Q1 Review',
        content: 'Key discussion points from the quarterly review meeting. Focus on performance metrics, team goals, and upcoming initiatives.',
        category: 'Work',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        color: 'bg-green-500'
      }
    ];
    setNotes(sampleNotes);
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...noteData, updatedAt: new Date() }
          : note
      ));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title || '',
        content: noteData.content || '',
        category: noteData.category || 'Personal',
        createdAt: new Date(),
        updatedAt: new Date(),
        color: categories.find(cat => cat.name === noteData.category)?.color || 'bg-gray-500'
      };
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Notes</h1>
          <p className="text-gray-600">Capture your thoughts and ideas</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('All')}
              className="transition-all duration-200"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className="transition-all duration-200"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Edit3 className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">No notes found</p>
              <p className="text-sm">Create your first note to get started</p>
            </div>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.5 }}
          className="fixed bottom-6 right-6"
        >
          <Button
            onClick={handleCreateNote}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Note Editor Modal */}
        <AnimatePresence>
          {showEditor && (
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onClose={handleCloseEditor}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}