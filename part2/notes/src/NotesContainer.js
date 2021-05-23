import Note from './Note'

function NotesContainer({ notes, changeNoteImportance, removeNoteFromState }) {

    function renderNotes() {
        return notes.map((note) => {
            return <Note key={note.id} note={note} changeNoteImportance={changeNoteImportance} removeNoteFromState={removeNoteFromState}/>
        })
    }

    return(
        <ul>
            {renderNotes()}
        </ul>
    )
}

export default NotesContainer;