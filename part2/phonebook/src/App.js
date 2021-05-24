import { useEffect, useState } from 'react'
import './App.css'
import Form from './components/Form'
import PersonsList from './components/PersonsList'
import Filter from './components/Filter'
import personServices from './services/persons'
import Notification from './components/Notification'

function App() {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personServices
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const matchingNamePerson = persons.find(({name}) => name.toLowerCase() === newName.toLowerCase())
    const matchingNumberPerson = persons.find(({number}) => number === newNumber)

    if (matchingNamePerson && !matchingNumberPerson) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        personServices
          .update(matchingNamePerson.id, {...matchingNamePerson, number: newNumber})
          .then(response => {
            let updatedPersons = () => {
              return persons.map((person) => {
                if (person.id === response.data.id) {
                  return {...person, number: response.data.number}
                }
                return person
              })
            }
            setMessage(`Updated ${response.data.name}`)
            setPersons(updatedPersons)
          })
      }
    } else if (!matchingNamePerson && matchingNumberPerson) {
      if(window.confirm(`update contact name for ${matchingNumberPerson.name} with the number ${matchingNumberPerson.number}?`)) {
        personServices
          .update(matchingNumberPerson.id, {...matchingNumberPerson, name: newName})
          .then(response => {
            let updatedPersons = () => {
              return persons.map((person) => {
                if (person.id === response.data.id) {
                  return {...person, name: response.data.name}
                }
                return person
              })
            }
            setMessage(`Updated ${response.data.name}`)
            setMessageType('success')
            setPersons(updatedPersons)
          })
      }
    } else if ((matchingNamePerson && matchingNumberPerson) && (matchingNamePerson === matchingNumberPerson)) {
      window.alert(`${newName} and ${newNumber} is already added to phonebook`)
    } else {
      personServices
      .create({name: newName, number: newNumber})
      .then(response => {
        setMessage(`Added ${response.data.name}`)
        setMessageType('success')
        setPersons(persons => [...persons, response.data])
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
      }, 5000)
      })
    }

  }

  function filterPersons() {
    return persons.filter(({name}) => {
      return name.toLowerCase().includes(searchVal.toLowerCase())
    })
  }

  function removeContact(contact_id, name) {
    personServices
      .remove(contact_id)
      .then(response => {
        setMessage(`${name} has been successfully removed from the server`)
        setMessageType('success')
        setPersons(persons.filter(({id}) => id !== contact_id))
      })
      .catch((error) => {
        setMessage(`${name} has already been removed from the server`)
        setMessageType('error')
      })
  }

  return (
    <div className="App">
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType}/>
      <Filter searchVal={searchVal} setSearchVal={setSearchVal} />
      <Form setNewName={setNewName} setNewNumber={setNewNumber} handleSubmit={handleSubmit} />
      <PersonsList persons={filterPersons()} removeContact={removeContact}/>
    </div>
  );
}

export default App;
