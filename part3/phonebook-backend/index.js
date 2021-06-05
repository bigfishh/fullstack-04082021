const express = require('express')
const app = express()

app.use(express.json())

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 7,
        "name": "JB",
        "number": "78-12-4958392"
    }
]

function findPerson(paramsId) {
    return phonebook.find(({id}) => id === paramsId)
}

function generateId() {
    const maxId = phonebook.length > 0 ? Math.max(...phonebook.map(({id}) => id)) : 0
    return maxId + 1
}

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${phonebook.length} ${phonebook.length === 1 ? 'person' : 'people'}</p> <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const requestedId = Number(request.params.id)
    const person = findPerson(requestedId)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const body = request.body 
    const foundName = phonebook.find(({name}) => name === body.name)

    if (!body.name || !body.number) {
        response.status(404).json({
            error: "please enter both the name and number"
        })
    } else if (foundName) {
        response.status(409).json({
            error: "name must be unique"
        })
    } else {
        const newPerson = {
            id: generateId(), 
            name: body.name,
            number: body.number
        }

        phonebook = phonebook.concat(newPerson)
        response.json(newPerson)
    }

})

app.delete('/api/persons/:id', (request, response) => {
    phonebook = phonebook.filter(({id}) => id !== Number(request.params.id))
    response.status(204).end()
})


const PORT = 3001
app.listen(PORT)