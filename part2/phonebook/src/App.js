import { useEffect, useState } from 'react'
import './App.css'
import Form from './components/Form'
import Persons from './components/Persons'
import Filter from './components/Filter'
import axios from 'axios'



function App() {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:30001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const matchingName = persons.find(({name}) => name.toLowerCase() === newName.toLowerCase())
    const matchingNumber = persons.find(({number}) => number === newNumber)

    if (matchingName || matchingNumber) {
      window.alert(`${newName} or ${newNumber} is already added to phonebook`)
      return 
    }

    axios
      .post('http://localhost:30001/persons',  {name: newName, number: newNumber})
      .then(response => {
        setPersons(persons => [...persons, response.data])
      })
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
