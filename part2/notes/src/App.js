import './App.css';
import {useState, useEffect} from 'react';
import NotesContainer from './components/NotesContainer';
import NotesForm from './components/NotesForm';
import Notification from './components/Notification';
import noteServices from './services/notes';

function App() {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteServices
      .getAll()
      .then((response) => {
        setNotes(response.data)
      })
  }, [])

  function addNewNote(newlyCreatedNote) {
    setNotes([...notes, newlyCreatedNote])
  }

  function changeNoteImportance(note_id) {
    const updatedNotes = notes.map((note) => {
      if (note.id === note_id) return {...note, important: !note.important}
      return note
    })

    setNotes(updatedNotes)
  }

  function filterNotes() {
    if (showAll) return notes
    return notes.filter(({important}) => important)
  }

  function removeNoteFromState(note_id) {
    const updatedNotes = notes.filter((note) => note.id !== note_id)
    setNotes(updatedNotes)
  }

  return (
    <div className="App">
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => {setShowAll(!showAll)}}>{showAll ? "important": "all"}</button>
      <NotesContainer notes={filterNotes()} changeNoteImportance={changeNoteImportance} setErrorMessage={setErrorMessage} removeNoteFromState={removeNoteFromState}/>
      <NotesForm newNote={newNote} setNewNote={setNewNote} addNewNote={addNewNote}/>
    </div>
  );
}

export default App;
