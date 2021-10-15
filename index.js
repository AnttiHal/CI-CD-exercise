require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req,res) => {
  return req.method + res.statusCode + req.url + JSON.stringify(req.body)}
)
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':body'))






let persons = [
    {
      "id": 1,
      "name": "Antti Halmetoja",
      "number": "04457023485"
    },
    {
      "id": 2,
      "name": "Pekka Puupää",
      "number": "04434535023485"
    },
    {
      "id": 3,
      "name": "Hezekiel Johnson",
      "number": "044234340953485"
    },
    {
      "id": 4,
      "name": "Michael Jackson",
      "number": "1234567"
    }
  ]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/info', (req, res) => {    
    Person.find({}).then(persons => {
      res.send(`<p>${new Date()} <br> Phonebook has info for  ${persons.length}   people.</p> `)}
    )
    .catch (error => next(error))

})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }) 
  .catch (error => next(error)) 
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})



const generateId = () => {
  const id = Math.floor(Math.random()*100000)
  return id
}

app.post('/api/persons', (req,res, next) => {  
  const body = req.body
  if (body.name === ''|| body.number === '') {
    return res.status(400).json({
      error: 'Name or number missing'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'Name already exists. Pick a new name.'
    })
  }
  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number
  })
  
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})

// middleware virheiden käsittelyyn
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error : 'malformatted id' })
  } 
  
  
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})