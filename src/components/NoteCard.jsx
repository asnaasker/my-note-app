
function formatText(text) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      )
    }

    return part
  })
}

function NoteCard({
  note,
  onDelete,
  onEdit,
  onPin,
  onArchive,
  selected,
  onSelect
}) {

  return (
    <div className={`${note.color} border rounded-xl p-4 shadow-sm`}>

      <div className="flex justify-between items-center mb-3">

        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(note.id)}
          aria-label="Select note"
        />

        <button
          onClick={() => onPin(note.id)}
          title="Pin or unpin note"
        >
          {note.pinned ? '📌' : '📍'}
        </button>

      </div>

      <h2 className="text-xl font-bold mb-3 break-words">
        {note.title || 'Untitled'}
      </h2>

      <div className="whitespace-pre-wrap break-words">
        {note.content.split('\n').map((line, index) => (
          <div key={index}>
            {line.startsWith('- ') ? (
              <span>• {formatText(line.slice(2))}</span>
            ) : (
              formatText(line)
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {note.tags.map(tag => (
          <span
            key={tag}
            className="bg-white/70 px-2 py-1 rounded-full text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Timestamps */}
      <div className="text-xs text-gray-500 mt-4 space-y-1">

        <p>
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>

        <p>
          Updated: {new Date(note.updatedAt).toLocaleString()}
        </p>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-4 border-t pt-3">

        <button
          onClick={() => onEdit(note)}
          className="text-blue-700"
        >
          Edit
        </button>

        <button
          onClick={() => onArchive(note.id)}
          className="text-purple-700"
        >
          {note.archived ? 'Unarchive' : 'Archive'}
        </button>

        <button
          onClick={() => onDelete(note.id)}
          className="text-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  )
}

export default NoteCard
