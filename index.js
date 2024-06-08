const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

// Allow cross-origin requests from any origin.
app.use(cors())

// Middleware to parse JSON data from request body.
app.use(express.json())
// app.use(morgan('tiny'))

// Custom token "body" to log request body.
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :body - :response-time ms", {
    skip: function (req, res) {
        if (req == undefined || req == null) {
            return true
        }
    }
}
))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// Self defined middleware to log request details, middleware is executed in the order they are defined.
// app.use(requestLogger)

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
];

app.get("/api/persons", (req, res) => {
    return res.json(persons)
})

app.get("/info", (req, res) => {
    const date = new Date()
    return res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `)
})

app.get("/api/persons/:id", (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find(person => person.id === id)
    if (person) {
        return res.status(200).json(person)
    } else {
        return res.status(404).end("Person not found")
    }
})

app.delete("/api/persons/:id", (req, res) => {
    let id = Number(req.params.id)
    // Delete person from persons array.
    persons = persons.filter(person => person.id !== id)
    return res.status(204).end("Person deleted")
})

app.post("/api/persons", (req, res) => {

    const getMaxId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(person => person.id))
            : 0
        return maxId
    }

    let person = req.body
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: "Name or number is missing"
        })
    }
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            error: "Name must be unique"
        })
    }
    // person.id = getMaxId() + 1
    person.id = Math.floor(Math.random() * 1000000)
    persons.push(person)
    return res.status(201).json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Use unknownEndpoint middleware to handle unknown endpoints after all other routes are checked (didn't hit any route).
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})