
import NoteCard from './NoteCard'

function NoteList({
  notes,
  onDelete,
  onEdit,
  onPin,
  onArchive,
  selected,
  onSelect
}) {

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-500">
          No Notes Found
        </h2>

        <p className="text-gray-400 mt-2">
          Your notes will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
          onPin={onPin}
          onArchive={onArchive}
          selected={selected.includes(note.id)}
          onSelect={onSelect}
        />
      ))}

    </div>
  )
}

export default NoteList
