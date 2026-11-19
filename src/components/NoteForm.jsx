
import { useEffect, useState } from 'react'

function NoteForm({ onSave, editingNote, onCancel, notes }) {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('bg-white')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
      setColor(editingNote.color)
      setTags(editingNote.tags.join(', '))
    } else {
      resetForm()
    }
  }, [editingNote])

  function resetForm() {
    setTitle('')
    setContent('')
    setColor('bg-white')
    setTags('')
    setError('')
  }

  // Text formatting
  function formatText(type) {
    const textarea = document.getElementById('note-content')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)

    let formatted = ''

    if (type === 'bold') {
      formatted = `**${selectedText || 'bold text'}**`
    } else if (type === 'italic') {
      formatted = `*${selectedText || 'italic text'}*`
    } else {
      formatted = `- ${selectedText || 'list item'}`
    }

    setContent(
      content.slice(0, start) +
      formatted +
      content.slice(end)
    )
  }

  // Form validation
  function handleSubmit(e) {
    e.preventDefault()

    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }

    if (title.length > 100) {
      setError('Title cannot exceed 100 characters')
      return
    }

    if (content.length > 5000) {
      setError('Content cannot exceed 5000 characters')
      return
    }

    if (tags.length > 100) {
      setError('Tags cannot exceed 100 characters')
      return
    }

    const cleanTitle = title.trim()
    const cleanContent = content.trim()

    // Prevent duplicate notes
    const duplicate = notes.some(note =>
      note.id !== editingNote?.id &&
      note.title.trim().toLowerCase() === cleanTitle.toLowerCase() &&
      note.content.trim().toLowerCase() === cleanContent.toLowerCase()
    )

    if (duplicate) {
      setError('This note already exists')
      return
    }

    const tagList = [
      ...new Set(
        tags.split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      )
    ]

    onSave({
      id: editingNote?.id,
      title: cleanTitle,
      content: cleanContent,
      color,
      tags: tagList,
      createdAt: editingNote?.createdAt
    })

    resetForm()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow-md mt-6"
    >

      <h2 className="text-xl font-bold mb-4">
        {editingNote ? 'Edit Note' : 'Create Note'}
      </h2>

      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        maxLength={100}
        onChange={e => {
          setTitle(e.target.value)
          setError('')
        }}
        className="border p-3 rounded-lg w-full mb-3"
      />

      {/* Formatting buttons */}
      <div className="flex gap-2 mb-2">

        <button
          type="button"
          onClick={() => formatText('bold')}
          className="border px-3 py-1 rounded font-bold"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => formatText('italic')}
          className="border px-3 py-1 rounded italic"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => formatText('list')}
          className="border px-3 py-1 rounded"
        >
          List
        </button>

      </div>

      <textarea
        id="note-content"
        placeholder="Take a note..."
        value={content}
        maxLength={5000}
        onChange={e => {
          setContent(e.target.value)
          setError('')
        }}
        rows="5"
        className="border p-3 rounded-lg w-full"
      />

      <input
        type="text"
        placeholder="Tags (separate with commas)"
        value={tags}
        maxLength={100}
        onChange={e => setTags(e.target.value)}
        className="border p-3 rounded-lg w-full mt-3"
      />

      {/* Colour picker */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Choose Note Colour</p>

        <div className="flex gap-3 flex-wrap">

          {[
            'bg-white',
            'bg-yellow-100',
            'bg-pink-100',
            'bg-green-100',
            'bg-blue-100',
            'bg-purple-100'
          ].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setColor(item)}
              className={`${item} w-9 h-9 rounded-full border-2 ${
                color === item
                  ? 'border-blue-600'
                  : 'border-gray-300'
              }`}
              aria-label={`Choose ${item}`}
            />
          ))}

        </div>
      </div>

      {error && (
        <p className="text-red-600 mt-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-5">

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>

        {editingNote && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  )
}

export default NoteForm
