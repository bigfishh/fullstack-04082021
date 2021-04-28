import { useState } from 'react'
import './App.css'
import Form from './components/Form'
import Persons from './components/Persons'
import Filter from './components/Filter'



function App() {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchVal, setSearchVal] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const matchingName = persons.find(({name}) => name.toLowerCase() === newName.toLowerCase())
    const matchingNumber = persons.find(({number}) => number === newNumber)
    if (matchingName || matchingNumber) {
      window.alert(`${newName} or ${newNumber} is already added to phonebook`)
      return 
    }
    setPersons(persons => [...persons, {name: newName, number: newNumber}])
  }

  function filterPersons() {
    return persons.filter(({name}) => {
      return name.toLowerCase().includes(searchVal.toLowerCase())
    })
  }

  return (
    <div className="App">
      <h2>Phonebook</h2>
      <Filter searchVal={searchVal} setSearchVal={setSearchVal} />
      <Form setNewName={setNewName} setNewNumber={setNewNumber} handleSubmit={handleSubmit} />
      <Persons persons={filterPersons()} />
    </div>
  );
}

export default App;
