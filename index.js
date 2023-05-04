const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

morgan.token('body', (req, _) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(cors())

let persons = [
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
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.status(200).json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    const date = new Date()
    const responseText = `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
    res.send(responseText)
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)
    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }


    const personToAdd = {
        "id": generateId(),
        "name": body.name,
        "number": body.number
    }

    if (persons.find(p => p.name === personToAdd.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    persons = persons.concat(personToAdd)

    res.status(200).end()
})

const PORT = process.env.PORT || "8080";
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})