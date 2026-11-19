
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('myNotes')
    return saved ? JSON.parse(saved) : []
  })

  const [editingNote, setEditingNote] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('active')
  const [sort, setSort] = useState('date')
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    localStorage.setItem('myNotes', JSON.stringify(notes))
  }, [notes])


  useEffect(() => {
    setLoading(false)
  }, [])


  function saveNote(note) {
    if (note.id) {
      setNotes(prev =>
        prev.map(item =>
          item.id === note.id
            ? { ...note, updatedAt: new Date().toISOString() }
            : item
        )
      )
    } else {
      const newNote = {
        ...note,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: false,
        pinned: false
      }

      setNotes(prev => [newNote, ...prev])
    }

    setEditingNote(null)
  }

  
  function deleteNote(id) {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== id))
      setSelected(prev => prev.filter(item => item !== id))
    }
  }

  function editNote(note) {
    setEditingNote(note)
  }

  function togglePin(id) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      )
    )
  }


  function toggleArchive(id) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, archived: !note.archived }
          : note
      )
    )
  }


  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }


  function deleteSelected() {
    if (selected.length === 0) return

    if (window.confirm('Delete selected notes?')) {
      setNotes(prev =>
        prev.filter(note => !selected.includes(note.id))
      )
      setSelected([])
    }
  }

  let filteredNotes = notes.filter(note => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchText))

    const matchesFilter =
      filter === 'active' ? !note.archived :
      filter === 'archived' ? note.archived :
      filter === 'pinned' ? note.pinned && !note.archived :
      note.tags.includes(filter)

    return matchesSearch && matchesFilter
  })

  filteredNotes.sort((a, b) => {
    if (sort === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    if (sort === 'title') {
      return a.title.localeCompare(b.title)
    }

    if (sort === 'color') {
      return a.color.localeCompare(b.color)
    }

    return 0
  })

  
  filteredNotes.sort((a, b) => Number(b.pinned) - Number(a.pinned))

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-6xl mx-auto p-4">

        <NoteForm
          onSave={saveNote}
          editingNote={editingNote}
          onCancel={() => setEditingNote(null)}
          notes={notes}
        />

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3 my-6">

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg p-3 flex-1"
          />

          {/* Filter */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="active">Active Notes</option>
            <option value="archived">Archived Notes</option>
            <option value="pinned">Pinned Notes</option>

            {[...new Set(notes.flatMap(note => note.tags))].map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="color">Sort by Color</option>
          </select>

        </div>

        {/* Bulk delete */}
        {selected.length > 0 && (
          <button
            onClick={deleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded mb-4"
          >
            Delete Selected
          </button>
        )}

        {loading ? (
          <p className="text-center p-10">Loading notes...</p>
        ) : (
          <NoteList
            notes={filteredNotes}
            onDelete={deleteNote}
            onEdit={editNote}
            onPin={togglePin}
            onArchive={toggleArchive}
            selected={selected}
            onSelect={toggleSelect}
          />
        )}

      </main>
    </div>
  )
}

export default App
