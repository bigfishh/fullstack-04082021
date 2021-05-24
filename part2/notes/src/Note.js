import noteServices from './services/notes';

function Note({ note, changeNoteImportance, removeNoteFromState, setErrorMessage }) {

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
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
    }

    return(
        <li className="note">
            <p>
                <button onClick={removeNote}>x</button>
                {note.content} 
                <button onClick={toggleImportance}>{label}</button>
            </p>
        </li>
    )
}

export default Note;