import noteServices from '../services/notes';

function NotesForm({newNote, setNewNote, addNewNote}) {

    function handleSubmit(e) {
        e.preventDefault()
        let newlySubmittedNote = {
            'content': newNote,
            'date': new Date(),
            'important': Math.random() < 0.5
        }
        noteServices
        .create(newlySubmittedNote)
            .then(response => {
                addNewNote(response.data)
                setNewNote('')
            })
    }

    return(
        <form onSubmit={handleSubmit}>
            <input value={newNote} onChange={(e) => {setNewNote(e.target.value)}}/>
            <button>save note</button>
        </form>
    )
}

export default NotesForm;