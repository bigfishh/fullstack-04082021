import noteServices from './services/notes';

function Note({ note, changeNoteImportance, removeNoteFromState }) {

    const label = note.important ? 'make not important' : 'make important'

    function toggleImportance() {
        noteServices
            .update(note.id, {...note, important: !note.important})
            .then(response => {
                changeNoteImportance(response.data.id)
            })
    }

    function removeNote() {
        noteServices
            .remove(note.id)
            .then(response => {
                removeNoteFromState(note.id)
            })
            .catch((error) => {
                alert(`the note '${note.content}' was already deleted from server`)
            })
    }

    return(
        <li>
            <p>
                <button onClick={removeNote}>x</button>
                {note.content} 
                <button onClick={toggleImportance}>{label}</button>
            </p>
        </li>
    )
}

export default Note;