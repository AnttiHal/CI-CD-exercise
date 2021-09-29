const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

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
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    let date = new Date()
    console.log(date)
    res.send('<p>Phonebook has info for ' + persons.length + ' people.</p> ' + date)
    

})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }    
})

app.delete('/api/persons/:id', (req, res) => {
  const id =Number(req.params.id)
  const person = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random()*100000)
  return id
}

app.post('/api/persons', (req,res) => {  
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number missing'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'Name already exists. Pick a new name.'
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)
  res.json(person)
})







const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})